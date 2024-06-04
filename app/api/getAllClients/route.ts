// app/api/getAllClients/route.ts
import { db } from '@/app/db';
import { clients, Client } from '@/app/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const allClients: Client[] = await db.select().from(clients);
  return NextResponse.json({ clients: allClients });
}
