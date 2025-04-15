import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/middleware/auth';
import supabase from '@/lib/supabase/client';

// Get all messages for a specific workspace
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const workspaceId = params.id;
  
  if (!workspaceId) {
    return NextResponse.json(
      { error: 'Workspace ID is required' },
      { status: 400 }
    );
  }

  try {
    // Validate the user
    const authResult = await validateToken(req);
    if (!authResult.isValid || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Get user entity ID based on role
    const { data: userData } = await supabase
      .from('users')
      .select(authResult.user.role === 'brand' ? 'linked_brand_id' : 'linked_supplier_id')
      .eq('id', authResult.user.id)
      .single();

    const entityId = authResult.user.role === 'brand' 
      ? userData?.linked_brand_id 
      : userData?.linked_supplier_id;

    if (!entityId) {
      return NextResponse.json(
        { error: `${authResult.user.role} not found` },
        { status: 404 }
      );
    }

    // Verify the workspace belongs to this user
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .eq(authResult.user.role === 'brand' ? 'brand_id' : 'supplier_id', entityId)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: 'Workspace not found or not accessible' },
        { status: 404 }
      );
    }

    // Get messages for the workspace, ordered by timestamp
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        timestamp,
        sender_id,
        users:sender_id(id, email, role)
      `)
      .eq('workspace_id', workspaceId)
      .order('timestamp', { ascending: true });

    if (messagesError) {
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Send a new message to a workspace
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const workspaceId = params.id;
  
  if (!workspaceId) {
    return NextResponse.json(
      { error: 'Workspace ID is required' },
      { status: 400 }
    );
  }

  try {
    // Validate the user
    const authResult = await validateToken(req);
    if (!authResult.isValid || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    const { content } = await req.json();
    
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Get user entity ID based on role
    const { data: userData } = await supabase
      .from('users')
      .select(authResult.user.role === 'brand' ? 'linked_brand_id' : 'linked_supplier_id')
      .eq('id', authResult.user.id)
      .single();

    const entityId = authResult.user.role === 'brand' 
      ? userData?.linked_brand_id 
      : userData?.linked_supplier_id;

    if (!entityId) {
      return NextResponse.json(
        { error: `${authResult.user.role} not found` },
        { status: 404 }
      );
    }

    // Verify the workspace belongs to this user
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .eq(authResult.user.role === 'brand' ? 'brand_id' : 'supplier_id', entityId)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: 'Workspace not found or not accessible' },
        { status: 404 }
      );
    }

    // Create the message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        workspace_id: workspaceId,
        sender_id: authResult.user.id,
        content,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (messageError) {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 