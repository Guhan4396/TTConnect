import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import supabase from '@/lib/supabase/client';

interface Workspace {
  supplier_id: string;
}

// Get all connected suppliers for a brand
export async function GET(req: NextRequest) {
  // Check if user is authenticated and has the brand role
  const authError = await requireRole(req, ['brand']);
  if (authError) return authError;

  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.split(' ')[1];
    
    // Decode token to get user info
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the brand ID associated with this user
    const { data: userData } = await supabase
      .from('users')
      .select('linked_brand_id')
      .eq('id', user.id)
      .single();

    if (!userData?.linked_brand_id) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const brandId = userData.linked_brand_id;

    // Get all workspaces for this brand
    const { data: workspaces, error: workspacesError } = await supabase
      .from('workspaces')
      .select('supplier_id')
      .eq('brand_id', brandId);

    if (workspacesError) {
      return NextResponse.json(
        { error: 'Failed to fetch supplier connections' },
        { status: 500 }
      );
    }

    // Extract supplier IDs
    const supplierIds = workspaces.map((workspace: Workspace) => workspace.supplier_id);

    // Get supplier details
    const { data: suppliers, error: suppliersError } = await supabase
      .from('suppliers')
      .select('id, name, address, contact, certifications, materials, value_processes, risk_score, profile_strength')
      .in('id', supplierIds);

    if (suppliersError) {
      return NextResponse.json(
        { error: 'Failed to fetch supplier details' },
        { status: 500 }
      );
    }

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 