import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import supabase from '@/lib/supabase/client';
import { validateToken } from '@/lib/middleware/auth';
import { ConnectionStatus } from '@/lib/models/types';

// Accept or decline a connection request
export async function POST(req: NextRequest) {
  // Check if user is authenticated and has the supplier role
  const authError = await requireRole(req, ['supplier']);
  if (authError) return authError;

  try {
    const { connectionRequestId, status } = await req.json();

    if (!connectionRequestId || !status) {
      return NextResponse.json(
        { error: 'Connection request ID and status are required' },
        { status: 400 }
      );
    }

    if (status !== 'accepted' && status !== 'declined') {
      return NextResponse.json(
        { error: 'Status must be either "accepted" or "declined"' },
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

    // Get the connection request and make sure it belongs to this supplier
    const { data: connectionRequest, error: fetchError } = await supabase
      .from('connection_requests')
      .select('id, brand_id, supplier_id, status')
      .eq('id', connectionRequestId)
      .eq('supplier_id', supplierId)
      .single();

    if (fetchError || !connectionRequest) {
      return NextResponse.json(
        { error: 'Connection request not found or not accessible' },
        { status: 404 }
      );
    }

    if (connectionRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Connection request has already been processed' },
        { status: 400 }
      );
    }

    // Update the connection request status
    const { error: updateError } = await supabase
      .from('connection_requests')
      .update({ status: status as ConnectionStatus })
      .eq('id', connectionRequestId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update connection request' },
        { status: 500 }
      );
    }

    // If accepted, create a workspace for the brand and supplier
    if (status === 'accepted') {
      const { error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          brand_id: connectionRequest.brand_id,
          supplier_id: connectionRequest.supplier_id
        });

      if (workspaceError) {
        return NextResponse.json(
          { error: 'Failed to create workspace' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: `Connection request ${status}`,
      connectionRequestId
    });
  } catch (error) {
    console.error(`Error processing connection request:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 