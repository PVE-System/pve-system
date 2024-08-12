// app/api/getAllClients/route.ts
/* import { db } from '@/app/db';
import { clients, Client } from '@/app/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const allClients: Client[] = await db.select().from(clients);
  return NextResponse.json({ clients: allClients });
} */

// app/api/getAllClients/route.ts
import { db } from '@/app/db';
import { clients, Client } from '@/app/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const allClients: Client[] = await db.select().from(clients);

  // Cria a resposta JSON com a lista de clientes
  const response = NextResponse.json({ clients: allClients });

  // Define o cabeçalho Cache-Control para evitar cache
  response.headers.set('Cache-Control', 'no-store, max-age=0');

  return response;
}
