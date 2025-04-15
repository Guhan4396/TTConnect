import { NextRequest, NextResponse } from 'next/server';
import { comparePassword } from '@/lib/utils/password';
import { generateToken } from '@/lib/middleware/auth';
import supabase from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Retrieve user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password, role, linked_brand_id, linked_supplier_id')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role);

    // Get associated entity details
    let entityDetails = null;
    if (user.role === 'brand' && user.linked_brand_id) {
      const { data: brand } = await supabase
        .from('brands')
        .select('id, name, logo')
        .eq('id', user.linked_brand_id)
        .single();
      
      entityDetails = brand;
    } else if (user.role === 'supplier' && user.linked_supplier_id) {
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id, name, profile_strength')
        .eq('id', user.linked_supplier_id)
        .single();
      
      entityDetails = supplier;
    }

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ...(user.role === 'brand' 
          ? { 
              brandId: user.linked_brand_id,
              brandDetails: entityDetails 
            } 
          : { 
              supplierId: user.linked_supplier_id,
              supplierDetails: entityDetails 
            }
        )
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 