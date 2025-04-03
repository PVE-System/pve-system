/* import { NextRequest, NextResponse } from 'next/server';
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
 */

import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({
    message: 'Logout realizado com sucesso',
  });

  // Serializa os cookies para deletá-los
  const deleteToken = serialize('token', '', {
    maxAge: -1,
    path: '/',
  });

  const deleteUserId = serialize('userId', '', {
    maxAge: -1,
    path: '/',
  });

  const deleteRole = serialize('role', '', {
    maxAge: -1,
    path: '/',
  });

  // Define os cookies no cabeçalho da resposta
  response.headers.set(
    'Set-Cookie',
    [deleteToken, deleteUserId, deleteRole].join('; '),
  );

  return response;
}
