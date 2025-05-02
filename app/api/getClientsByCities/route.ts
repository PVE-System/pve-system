export const dynamic = 'force-dynamic';

/* import { NextRequest, NextResponse } from 'next/server';
import { and, eq, not, inArray, ilike, or, asc, desc } from 'drizzle-orm';
import { db } from '@/app/db';
import { clients } from '@/app/db/schema';

export async function GET(req: NextRequest) {
  try {
    const state = req.nextUrl.searchParams.get('state');
    const city = req.nextUrl.searchParams.get('city') || '';

    if (!state) {
      return NextResponse.json(
        { error: 'Parâmetro "state" é obrigatório.' },
        { status: 400 },
      );
    }

    const whereConditions = [];

    // Filtro por Estado
    if (state === 'MS') {
      whereConditions.push(eq(clients.state, 'MS'));
    } else if (state === 'MT') {
      whereConditions.push(eq(clients.state, 'MT'));
    } else if (state === 'OUTRAS') {
      whereConditions.push(not(inArray(clients.state, ['MS', 'MT'])));
    }

    // Filtro por Cidade (só se foi selecionada alguma)
    if (city) {
      whereConditions.push(eq(clients.city, city));
    }

    const results = await db
      .select()
      .from(clients)
      .where(and(...whereConditions));

    return NextResponse.json({ clients: results }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a busca. Tente novamente mais tarde.' },
      { status: 500 },
    );
  }
}
 */

import { NextRequest, NextResponse } from 'next/server';
import { and, eq, not, inArray } from 'drizzle-orm';
import { db } from '@/app/db';
import { clients } from '@/app/db/schema';

export async function GET(req: NextRequest) {
  try {
    const state = req.nextUrl.searchParams.get('state');
    const city = req.nextUrl.searchParams.get('city') || '';

    if (!state) {
      return NextResponse.json(
        { error: 'Parâmetro "state" é obrigatório.' },
        { status: 400 },
      );
    }

    const whereConditions = [];

    // Filtro por Estado
    if (state === 'MS') {
      whereConditions.push(eq(clients.state, 'MS'));
    } else if (state === 'MT') {
      whereConditions.push(eq(clients.state, 'MT'));
    } else if (state === 'OUTRAS') {
      whereConditions.push(not(inArray(clients.state, ['MS', 'MT'])));
    }

    // Filtro por Cidade (se aplicável)
    if (city) {
      whereConditions.push(eq(clients.city, city));
    }

    // Buscar do banco
    const results = await db
      .select()
      .from(clients)
      .where(and(...whereConditions));

    // Ordenar: A-Z, ignora espaços, nomes com números no final
    const sortedClients = results.sort((a, b) => {
      const normalize = (str: string) => str.trim().toLowerCase();
      const valA = normalize(a.companyName);
      const valB = normalize(b.companyName);

      const startsWithNumberA = /^\d/.test(valA);
      const startsWithNumberB = /^\d/.test(valB);

      if (startsWithNumberA && !startsWithNumberB) return 1;
      if (!startsWithNumberA && startsWithNumberB) return -1;

      return valA.localeCompare(valB, 'pt-BR', { sensitivity: 'base' });
    });

    return NextResponse.json({ clients: sortedClients }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a busca. Tente novamente mais tarde.' },
      { status: 500 },
    );
  }
}
