import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginUser, signToken } from '@/lib/auth';
import { debug } from '@/lib/debug';

export async function POST(request: Request) {
  try {
    debug('Login attempt started');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      debug('Invalid JSON in request body', { level: 'error', data: e });
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    debug('Login credentials received', { data: { email }});

    // Validate input
    if (!email || typeof email !== 'string') {
      debug('Invalid email format', { level: 'error', data: { email }});
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      debug('Invalid password format', { level: 'error' });
      return NextResponse.json(
        { error: 'Valid password is required' },
        { status: 400 }
      );
    }

    // Attempt login
    let user;
    try {
      user = await loginUser(email, password);
    } catch (e) {
      debug('Login function error', { level: 'error', data: e });
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      );
    }
    
    if (!user) {
      debug('Invalid credentials', { level: 'warn', data: { email }});
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    debug('User authenticated successfully', { data: { userId: user.id, role: user.role }});

    // Create token
    let token;
    try {
      token = await signToken({
        id: user.id,
        email: user.email,
        role: user.role,
        gymId: user.gymId
      });
    } catch (e) {
      debug('Token creation error', { level: 'error', data: e });
      return NextResponse.json(
        { error: 'Error creating session' },
        { status: 500 }
      );
    }

    debug('JWT token created');

    // Set cookie
    try {
      cookies().set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
      });
    } catch (e) {
      debug('Cookie setting error', { level: 'error', data: e });
      return NextResponse.json(
        { error: 'Error creating session' },
        { status: 500 }
      );
    }

    debug('Cookie set successfully');

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        gymId: user.gymId
      }
    });
  } catch (error) {
    debug('Unhandled error in login route', { 
      level: 'error', 
      data: error 
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 