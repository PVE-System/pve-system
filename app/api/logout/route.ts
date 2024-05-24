/* import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const response = NextResponse.next();

  // Serialize the cookie to delete it
  const deleteCookie = serialize('token', '', {
    maxAge: -1,
    path: '/',
  });

  response.headers.set('Set-Cookie', deleteCookie);
  return NextResponse.json({ message: 'Logout realizado com sucesso' });
} */

import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({
    message: 'Logout realizado com sucesso',
  });

  // Serialize the cookie to delete it
  const deleteCookie = serialize('token', '', {
    maxAge: -1,
    path: '/',
  });

  // Set the cookie header in the response
  response.headers.set('Set-Cookie', deleteCookie);
  return response;
}
