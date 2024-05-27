// middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value;

  if (currentUser && !request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  if (!currentUser && !request.nextUrl.pathname.startsWith('/')) {
    return NextResponse.redirect('/');
  }

  return NextResponse.next();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
