export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { ilike, or, sql, eq, and } from 'drizzle-orm';
import { clients, users } from '@/app/db/schema';
import { db } from '@/app/db';

export async function GET(req: NextRequest) {
  try {
    // Buscar role e userId dos cookies
    const userRole = req.cookies.get('role')?.value;
    const userId = req.cookies.get('userId')?.value;

    const searchQuery = req.nextUrl.searchParams.get('query') || '';

    const normalizedSearch = searchQuery
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    const numericSearch = searchQuery.replace(/\D/g, '');

    // Preparar filtro de vendedor externo
    let whereConditions = [];

    if (userRole === 'vendedor externo' && userId) {
      // Para vendedor externo, buscar o operatorNumber do usuário
      const user = await db
        .select({ operatorNumber: users.operatorNumber })
        .from(users)
        .where(eq(users.id, parseInt(userId)))
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 },
        );
      }

      const operatorNumber = user[0].operatorNumber;
      whereConditions.push(eq(clients.responsibleSeller, operatorNumber));
    }

    let results = [];

    // 🔍 Verifica se é CPF/CNPJ (ex: mais de 8 números)
    if (numericSearch.length >= 8) {
      const searchConditions = [
        sql<boolean>`REGEXP_REPLACE(${clients.cpf}, '[^0-9]', '', 'g') ILIKE ${`%${numericSearch}%`}`,
        sql<boolean>`REGEXP_REPLACE(${clients.cnpj}, '[^0-9]', '', 'g') ILIKE ${`%${numericSearch}%`}`,
      ];

      const allConditions =
        whereConditions.length > 0
          ? [and(...whereConditions), or(...searchConditions)]
          : searchConditions;

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
          whereConditions.length > 0
            ? and(...allConditions)
            : or(...searchConditions),
        )
        .orderBy(sql`LOWER(${clients.companyName})`);
    } else {
      // 🔍 Busca padrão por texto
      const searchConditions = [
        ilike(clients.companyName, `%${normalizedSearch}%`),
        ilike(clients.corfioCode, `%${normalizedSearch}%`),
        ilike(clients.responsibleSeller, `%${normalizedSearch}%`),
      ];

      const allConditions =
        whereConditions.length > 0
          ? [and(...whereConditions), or(...searchConditions)]
          : searchConditions;

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
          whereConditions.length > 0
            ? and(...allConditions)
            : or(...searchConditions),
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
