import { db } from '@/app/db';
import { clients, Client } from '@/app/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    const allClients: Client[] = await db.select().from(clients);

    // Ordenação: A-Z, ignorando espaços e colocando números no fim
    const sortedClients = allClients.sort((a, b) => {
      const valA = String(a.companyName || '')
        .trim()
        .toLowerCase();
      const valB = String(b.companyName || '')
        .trim()
        .toLowerCase();

      const startsWithNumberA = /^\d/.test(valA);
      const startsWithNumberB = /^\d/.test(valB);

      if (startsWithNumberA && !startsWithNumberB) return 1;
      if (!startsWithNumberA && startsWithNumberB) return -1;

      return valA.localeCompare(valB, 'pt-BR', { sensitivity: 'base' });
    });

    revalidateTag('clients');

    return NextResponse.json({ clients: sortedClients });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro ao processar os dados' },
      { status: 500 },
    );
  }
}
