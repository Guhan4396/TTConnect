import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import supabase from '@/lib/supabase/client';
import { validateToken } from '@/lib/middleware/auth';
import { CertificationStatus } from '@/lib/models/types';

// Upload a new certification
export async function POST(req: NextRequest) {
  // Check if user is authenticated and has the supplier role
  const authError = await requireRole(req, ['supplier']);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const file = formData.get('file') as File;
    const expiryDate = formData.get('expiry_date') as string;

    if (!name || !file) {
      return NextResponse.json(
        { error: 'Name and file are required' },
        { status: 400 }
      );
    }

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

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${supplierId}_${Date.now()}.${fileExt}`;
    const filePath = `certifications/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // Determine certification status based on expiry date
    let status: CertificationStatus = 'valid';
    if (expiryDate) {
      const now = new Date();
      const expiry = new Date(expiryDate);
      if (expiry < now) {
        status = 'expired';
      }
    }

    // Create certification record
    const { data: certification, error: certError } = await supabase
      .from('certifications')
      .insert({
        supplier_id: supplierId,
        name,
        status,
        uploaded_file: publicUrl,
        expiry_date: expiryDate || null
      })
      .select()
      .single();

    if (certError) {
      return NextResponse.json(
        { error: 'Failed to create certification record' },
        { status: 500 }
      );
    }

    // Update supplier's certifications array
    const { data: supplier } = await supabase
      .from('suppliers')
      .select('certifications')
      .eq('id', supplierId)
      .single();

    if (supplier) {
      const updatedCertifications = [...(supplier.certifications || [])];
      if (!updatedCertifications.includes(name)) {
        updatedCertifications.push(name);
        
        await supabase
          .from('suppliers')
          .update({ certifications: updatedCertifications })
          .eq('id', supplierId);
      }
    }

    return NextResponse.json({
      message: 'Certification uploaded successfully',
      certification
    });
  } catch (error) {
    console.error('Error uploading certification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all certifications for a supplier
export async function GET(req: NextRequest) {
  try {
    // Validate the user
    const authResult = await validateToken(req);
    if (!authResult.isValid || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    let supplierId: string | null = null;

    // If user is a supplier, get their own certifications
    if (authResult.user.role === 'supplier') {
      const { data: userData } = await supabase
        .from('users')
        .select('linked_supplier_id')
        .eq('id', authResult.user.id)
        .single();

      supplierId = userData?.linked_supplier_id || null;
    } else if (authResult.user.role === 'brand') {
      // If user is a brand, they can query a specific supplier's certifications
      const url = new URL(req.url);
      supplierId = url.searchParams.get('supplier_id');

      // Check if the supplier has opted in or connected with this brand
      if (supplierId) {
        const { data: brandData } = await supabase
          .from('users')
          .select('linked_brand_id')
          .eq('id', authResult.user.id)
          .single();
        
        const brandId = brandData?.linked_brand_id;
        
        if (brandId) {
          // Check if supplier has opted in or has a workspace with this brand
          const { data: supplier } = await supabase
            .from('suppliers')
            .select('opted_in_brands')
            .eq('id', supplierId)
            .single();
          
          const { data: workspace } = await supabase
            .from('workspaces')
            .select('id')
            .eq('brand_id', brandId)
            .eq('supplier_id', supplierId)
            .single();
          
          const hasOptedIn = supplier?.opted_in_brands?.includes(brandId);
          const isConnected = !!workspace;
          
          if (!hasOptedIn && !isConnected) {
            return NextResponse.json(
              { error: 'Unauthorized to view this supplier\'s certifications' },
              { status: 403 }
            );
          }
        }
      }
    }

    if (!supplierId) {
      return NextResponse.json(
        { error: 'Supplier ID is required' },
        { status: 400 }
      );
    }

    // Get certifications
    const { data: certifications, error } = await supabase
      .from('certifications')
      .select('id, name, status, uploaded_file, expiry_date, created_at')
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch certifications' },
        { status: 500 }
      );
    }

    return NextResponse.json({ certifications });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 