import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/middleware/auth';
import supabase from '@/lib/supabase/client';

export async function GET(req: NextRequest) {
  try {
    const authResult = await validateToken(req);
    
    if (!authResult.isValid || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, email, role } = authResult.user;

    // Get associated entity details
    let entityDetails = null;
    let entityId = null;

    if (role === 'brand') {
      // Get the brand ID
      const { data: userData } = await supabase
        .from('users')
        .select('linked_brand_id')
        .eq('id', id)
        .single();

      if (userData?.linked_brand_id) {
        entityId = userData.linked_brand_id;
        
        // Get brand details
        const { data: brand } = await supabase
          .from('brands')
          .select('id, name, logo')
          .eq('id', entityId)
          .single();
        
        entityDetails = brand;
      }
    } else if (role === 'supplier') {
      // Get the supplier ID
      const { data: userData } = await supabase
        .from('users')
        .select('linked_supplier_id')
        .eq('id', id)
        .single();

      if (userData?.linked_supplier_id) {
        entityId = userData.linked_supplier_id;
        
        // Get supplier details
        const { data: supplier } = await supabase
          .from('suppliers')
          .select('id, name, profile_strength, risk_score')
          .eq('id', entityId)
          .single();
        
        entityDetails = supplier;
      }
    }

    return NextResponse.json({
      user: {
        id,
        email,
        role,
        ...(role === 'brand' 
          ? { 
              brandId: entityId,
              brandDetails: entityDetails 
            } 
          : { 
              supplierId: entityId,
              supplierDetails: entityDetails 
            }
        )
      }
    });
  } catch (error) {
    console.error('Auth validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 