import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import supabase from '@/lib/supabase/client';
import { validateToken } from '@/lib/middleware/auth';

// Get filtered list of suppliers for the marketplace
export async function GET(req: NextRequest) {
  // Check if user is authenticated and has the brand role
  const authError = await requireRole(req, ['brand']);
  if (authError) return authError;

  try {
    // Parse query parameters
    const url = new URL(req.url);
    const certifications = url.searchParams.get('certifications')?.split(',') || [];
    const valueProcesses = url.searchParams.get('value_processes')?.split(',') || [];
    const materials = url.searchParams.get('materials')?.split(',') || [];
    const minProfileStrength = parseInt(url.searchParams.get('min_profile_strength') || '0');
    const maxRiskScore = parseInt(url.searchParams.get('max_risk_score') || '100');
    const excludeSupplierId = url.searchParams.get('exclude_supplier_id') || null;

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

    // Start query
    let query = supabase
      .from('suppliers')
      .select('id, name, address, contact, certifications, materials, value_processes, risk_score, profile_strength')
      .contains('opted_in_brands', [brandId])
      .gte('profile_strength', minProfileStrength)
      .lte('risk_score', maxRiskScore);

    // Apply filters if provided
    if (certifications.length > 0 && certifications[0] !== '') {
      query = query.contains('certifications', certifications);
    }

    if (valueProcesses.length > 0 && valueProcesses[0] !== '') {
      query = query.contains('value_processes', valueProcesses);
    }

    if (materials.length > 0 && materials[0] !== '') {
      query = query.contains('materials', materials);
    }

    // Exclude specific supplier if needed (for replacement flow)
    if (excludeSupplierId) {
      query = query.neq('id', excludeSupplierId);
    }

    // Execute query
    const { data: suppliers, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch suppliers' },
        { status: 500 }
      );
    }

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error('Error fetching marketplace suppliers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 