import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/utils/password';
import supabase from '@/lib/supabase/client';
import { UserRole } from '@/lib/models/types';

export async function POST(req: NextRequest) {
  try {
    const { email, password, role, name } = await req.json();

    // Basic validation
    if (!email || !password || !role || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if role is valid
    if (role !== 'brand' && role !== 'supplier') {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create associated entity (brand or supplier)
    let entityId: string | undefined;
    
    if (role === 'brand') {
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .insert({ name })
        .select('id')
        .single();

      if (brandError) {
        return NextResponse.json(
          { error: 'Failed to create brand' },
          { status: 500 }
        );
      }
      
      entityId = brand.id;
    } else {
      const { data: supplier, error: supplierError } = await supabase
        .from('suppliers')
        .insert({ 
          name,
          address: '',
          contact: { email },
          certifications: [],
          materials: [],
          value_processes: [],
          facilities: [],
          risk_score: 0,
          profile_strength: 0,
          opted_in_brands: [] 
        })
        .select('id')
        .single();

      if (supplierError) {
        return NextResponse.json(
          { error: 'Failed to create supplier' },
          { status: 500 }
        );
      }
      
      entityId = supplier.id;
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        role: role as UserRole,
        ...(role === 'brand' ? { linked_brand_id: entityId } : { linked_supplier_id: entityId })
      })
      .select('id, email, role, linked_brand_id, linked_supplier_id')
      .single();

    if (userError) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          ...(user.role === 'brand' ? { brandId: user.linked_brand_id } : { supplierId: user.linked_supplier_id })
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 