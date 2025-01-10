import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { debug } from '@/lib/debug';

export async function POST() {
  try {
    debug('Logout attempt started');

    // Clear the auth cookie
    cookies().delete('token');

    debug('Logout successful - cookie cleared');

    return NextResponse.json({ success: true });
  } catch (error) {
    debug('Logout error occurred', { 
      level: 'error', 
      data: error 
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 