export const dynamic = 'force-dynamic';

import { db } from '@/app/db';
import { clients, Client } from '@/app/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os clientes no banco de dados com a ordenação personalizada
    const allClients: Client[] = await db
      .select()
      .from(clients)
      .orderBy(
        sql`CASE
          WHEN trim(${clients.companyName}) ~ '^[0-9]' THEN 1
          ELSE 0
        END,
        trim(${clients.companyName}) ASC
        `,
      );

    // Revalidar a tag 'clients' para garantir que o cache seja atualizado (opcional, dependendo do cache strategy)
    revalidateTag('clients');

    // Criar a resposta JSON com a lista de clientes ordenada
    return NextResponse.json({ clients: allClients });
  } catch (error) {
    console.error('Error fetching clients with custom order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients with custom order' },
      { status: 500 },
    );
  }
}
