import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import supabase from '@/lib/supabase/client';
import { validateToken } from '@/lib/middleware/auth';

// Send a connection request from a brand to a supplier
export async function POST(req: NextRequest) {
  // Check if user is authenticated and has the brand role
  const authError = await requireRole(req, ['brand']);
  if (authError) return authError;

  try {
    const { supplierId, message } = await req.json();

    if (!supplierId) {
      return NextResponse.json(
        { error: 'Supplier ID is required' },
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

    // Get the brand ID associated with this user
    const { data: userData } = await supabase
      .from('users')
      .select('linked_brand_id')
      .eq('id', authResult.user.id)
      .single();

    if (!userData?.linked_brand_id) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    const brandId = userData.linked_brand_id;

    // Check if supplier exists
    const { data: supplier } = await supabase
      .from('suppliers')
      .select('id')
      .eq('id', supplierId)
      .single();

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }

    // Check if connection already exists
    const { data: existingConnection } = await supabase
      .from('connection_requests')
      .select('id, status')
      .eq('brand_id', brandId)
      .eq('supplier_id', supplierId)
      .single();

    if (existingConnection) {
      return NextResponse.json(
        { 
          error: 'Connection request already exists', 
          status: existingConnection.status 
        },
        { status: 409 }
      );
    }

    // Create connection request
    const { data: connectionRequest, error } = await supabase
      .from('connection_requests')
      .insert({
        brand_id: brandId,
        supplier_id: supplierId,
        status: 'pending',
        initial_message: message || ''
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create connection request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Connection request sent successfully',
      connectionRequest
    });
  } catch (error) {
    console.error('Error creating connection request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all connection requests for the authenticated user
export async function GET(req: NextRequest) {
  // Validate the token
  const authResult = await validateToken(req);
  if (!authResult.isValid || !authResult.user) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }

  try {
    const { role } = authResult.user;
    
    // Get the user's associated entity ID
    const { data: userData } = await supabase
      .from('users')
      .select(role === 'brand' ? 'linked_brand_id' : 'linked_supplier_id')
      .eq('id', authResult.user.id)
      .single();

    const entityId = role === 'brand' 
      ? userData?.linked_brand_id 
      : userData?.linked_supplier_id;

    if (!entityId) {
      return NextResponse.json(
        { error: `${role} not found` },
        { status: 404 }
      );
    }

    // Get connection requests based on role
    const { data: connectionRequests, error } = await supabase
      .from('connection_requests')
      .select(`
        id, 
        status, 
        initial_message, 
        created_at,
        ${role === 'brand' 
          ? 'supplier_id, suppliers:supplier_id(id, name, profile_strength, risk_score)' 
          : 'brand_id, brands:brand_id(id, name, logo)'
        }
      `)
      .eq(role === 'brand' ? 'brand_id' : 'supplier_id', entityId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch connection requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({ connectionRequests });
  } catch (error) {
    console.error('Error fetching connection requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 