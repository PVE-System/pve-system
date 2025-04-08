import { NextRequest, NextResponse } from 'next/server';
import { ilike, or, sql } from 'drizzle-orm';
import { clients } from '@/app/db/schema';
import { db } from '@/app/db';

export async function GET(req: NextRequest) {
  try {
    const searchQuery = req.nextUrl.searchParams.get('query') || '';

    const normalizedSearch = searchQuery
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    const numericSearch = searchQuery.replace(/\D/g, '');

    let results = [];

    // 🔍 Verifica se é CPF/CNPJ (ex: mais de 8 números)
    if (numericSearch.length >= 8) {
      results = await db
        .select({
          id: clients.id,
          companyName: clients.companyName,
          corfioCode: clients.corfioCode,
          clientCondition: clients.clientCondition,
          rating: clients.rating,
          responsibleSeller: clients.responsibleSeller,
        })
        .from(clients)
        .where(
          or(
            sql<boolean>`REGEXP_REPLACE(${clients.cpf}, '[^0-9]', '', 'g') ILIKE ${`%${numericSearch}%`}`,
            sql<boolean>`REGEXP_REPLACE(${clients.cnpj}, '[^0-9]', '', 'g') ILIKE ${`%${numericSearch}%`}`,
          ),
        )
        .orderBy(sql`LOWER(${clients.companyName})`);
    } else {
      // 🔍 Busca padrão por texto
      results = await db
        .select({
          id: clients.id,
          companyName: clients.companyName,
          corfioCode: clients.corfioCode,
          clientCondition: clients.clientCondition,
          rating: clients.rating,
          responsibleSeller: clients.responsibleSeller,
        })
        .from(clients)
        .where(
          or(
            ilike(clients.companyName, `%${normalizedSearch}%`),
            ilike(clients.corfioCode, `%${normalizedSearch}%`),
            ilike(clients.responsibleSeller, `%${normalizedSearch}%`),
          ),
        )
        .orderBy(sql`LOWER(${clients.companyName})`);
    }

    return NextResponse.json({ clients: results }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a busca. Tente novamente mais tarde.' },
      { status: 500 },
    );
  }
}
