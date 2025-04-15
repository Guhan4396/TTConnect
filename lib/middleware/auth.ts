import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/types';

interface DecodedToken {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export async function validateToken(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return { 
        isValid: false, 
        error: 'No token provided', 
        user: null 
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    return { 
      isValid: true, 
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      },
      error: null 
    };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Invalid token', 
      user: null 
    };
  }
}

export async function requireAuth(req: NextRequest) {
  const authResult = await validateToken(req);
  
  if (!authResult.isValid) {
    return NextResponse.json(
      { error: authResult.error },
      { status: 401 }
    );
  }
  
  return null; // Auth successful, continue to the handler
}

export async function requireRole(req: NextRequest, allowedRoles: UserRole[]) {
  const authResult = await validateToken(req);
  
  if (!authResult.isValid || !authResult.user) {
    return NextResponse.json(
      { error: authResult.error },
      { status: 401 }
    );
  }
  
  if (!allowedRoles.includes(authResult.user.role)) {
    return NextResponse.json(
      { error: 'Unauthorized: Insufficient permissions' },
      { status: 403 }
    );
  }
  
  return null; // Auth successful, role check passed
}

export function generateToken(userId: string, email: string, role: UserRole) {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
} 