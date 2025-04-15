import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import supabase from '@/lib/supabase/client';
import { validateToken } from '@/lib/middleware/auth';

interface Brand {
  id: string;
  name: string;
  logo?: string;
}

// Opt into or out of brand visibility
export async function POST(req: NextRequest) {
  // Check if user is authenticated and has the supplier role
  const authError = await requireRole(req, ['supplier']);
  if (authError) return authError;

  try {
    const { brandId, opt } = await req.json();

    if (!brandId || opt === undefined) {
      return NextResponse.json(
        { error: 'Brand ID and opt status are required' },
        { status: 400 }
      );
    }

    // Convert to boolean
    const optIn = !!opt;

    // Get the authenticated user
    const authResult = await validateToken(req);
    if (!authResult.isValid || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Get the supplier ID associated with this user
    const { data: userData } = await supabase
      .from('users')
      .select('linked_supplier_id')
      .eq('id', authResult.user.id)
      .single();

    if (!userData?.linked_supplier_id) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }

    const supplierId = userData.linked_supplier_id;

    // Check if brand exists
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('id', brandId)
      .single();

    if (brandError || !brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Get current opted-in brands
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers')
      .select('opted_in_brands')
      .eq('id', supplierId)
      .single();

    if (supplierError || !supplier) {
      return NextResponse.json(
        { error: 'Failed to fetch supplier data' },
        { status: 500 }
      );
    }

    let updatedOptedInBrands = [...(supplier.opted_in_brands || [])];

    if (optIn) {
      // Add brand ID if it doesn't exist
      if (!updatedOptedInBrands.includes(brandId)) {
        updatedOptedInBrands.push(brandId);
      }
    } else {
      // Remove brand ID if it exists
      updatedOptedInBrands = updatedOptedInBrands.filter(id => id !== brandId);
    }

    // Update supplier's opted_in_brands
    const { error: updateError } = await supabase
      .from('suppliers')
      .update({ opted_in_brands: updatedOptedInBrands })
      .eq('id', supplierId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update opted-in brands' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: optIn ? 'Successfully opted in to brand' : 'Successfully opted out of brand',
      brandId,
      optedInBrands: updatedOptedInBrands
    });
  } catch (error) {
    console.error('Error updating brand opt-in status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all available brands for a supplier to opt into
export async function GET(req: NextRequest) {
  // Check if user is authenticated and has the supplier role
  const authError = await requireRole(req, ['supplier']);
  if (authError) return authError;

  try {
    // Get the authenticated user
    const authResult = await validateToken(req);
    if (!authResult.isValid || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Get the supplier ID associated with this user
    const { data: userData } = await supabase
      .from('users')
      .select('linked_supplier_id')
      .eq('id', authResult.user.id)
      .single();

    if (!userData?.linked_supplier_id) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }

    const supplierId = userData.linked_supplier_id;

    // Get current opted-in brands
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers')
      .select('opted_in_brands')
      .eq('id', supplierId)
      .single();

    if (supplierError || !supplier) {
      return NextResponse.json(
        { error: 'Failed to fetch supplier data' },
        { status: 500 }
      );
    }

    // Get all brands
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('id, name, logo');

    if (brandsError) {
      return NextResponse.json(
        { error: 'Failed to fetch brands' },
        { status: 500 }
      );
    }

    // Mark brands that are already opted in
    const brandsWithOptStatus = brands.map((brand: Brand) => ({
      ...brand,
      opted_in: supplier.opted_in_brands?.includes(brand.id) || false
    }));

    return NextResponse.json({ brands: brandsWithOptStatus });
  } catch (error) {
    console.error('Error fetching opt-in brands:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 