export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { and, eq, not, inArray, ilike, or, asc, desc } from 'drizzle-orm';
import { db } from '@/app/db';
import { clients, users } from '@/app/db/schema';

export async function GET(req: NextRequest) {
  try {
    // Buscar role e userId dos cookies
    const userRole = req.cookies.get('role')?.value;
    const userId = req.cookies.get('userId')?.value;

    const page = req.nextUrl.searchParams.get('page');

    // Detecta a página pela URL
    const isMsPage = page === 'clientsMsList';
    const isMtPage = page === 'clientsMtList';
    const isOtherUfPage = page === 'clientsOtherUfList';
    const isCNPJPage = page === 'clientsCNPJList';
    const isCPFPage = page === 'clientsCPFList';
    const isClientsNormalPage = page === 'clientsNormalList';
    const isClientsEspecialPage = page === 'clientsEspecialList';
    const isClientsSuspendedPage = page === 'clientsSuspendedList';
    const isRating1Page = page === 'clientsRating1List';
    const isRating2Page = page === 'clientsRating2List';
    const isRating3Page = page === 'clientsRating3List';

    // Se nenhuma for válida, retorna erro
    if (
      !isMsPage &&
      !isMtPage &&
      !isOtherUfPage &&
      !isCNPJPage &&
      !isCPFPage &&
      !isClientsNormalPage &&
      !isClientsEspecialPage &&
      !isClientsSuspendedPage &&
      !isRating1Page &&
      !isRating2Page &&
      !isRating3Page
    ) {
      return NextResponse.json({ error: 'Página inválida' }, { status: 400 });
    }

    const clientCondition = req.nextUrl.searchParams.get('clientCondition');
    const searchQuery = req.nextUrl.searchParams.get('query') || '';
    const orderBy = 'companyName';
    const order = 'asc';

    const normalizedSearch = searchQuery
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    // Filtros
    const whereConditions = [];

    // Filtro para vendedor externo - sempre aplicar primeiro
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

    if (isMsPage) {
      whereConditions.push(eq(clients.state, 'MS'));
    } else if (isMtPage) {
      whereConditions.push(eq(clients.state, 'MT'));
    } else if (isOtherUfPage) {
      whereConditions.push(not(inArray(clients.state, ['MS', 'MT'])));
    } else if (isCNPJPage) {
      whereConditions.push(not(eq(clients.cnpj, '')));
    } else if (isCPFPage) {
      whereConditions.push(not(eq(clients.cpf, '')));
    }

    if (isClientsNormalPage) {
      whereConditions.push(eq(clients.clientCondition, 'Normal'));
    } else if (isClientsEspecialPage) {
      whereConditions.push(eq(clients.clientCondition, 'Especial'));
    } else if (isClientsSuspendedPage) {
      whereConditions.push(eq(clients.clientCondition, 'Suspenso'));
    }

    if (isRating1Page) {
      whereConditions.push(eq(clients.rating, 1));
    } else if (isRating2Page) {
      whereConditions.push(eq(clients.rating, 2));
    } else if (isRating3Page) {
      whereConditions.push(eq(clients.rating, 3));
    }

    if (clientCondition) {
      whereConditions.push(eq(clients.clientCondition, clientCondition));
    }

    if (normalizedSearch) {
      whereConditions.push(
        or(
          ilike(clients.companyName, `%${normalizedSearch}%`),
          ilike(clients.cnpj, `%${normalizedSearch}%`),
          ilike(clients.cpf, `%${normalizedSearch}%`),
          ilike(clients.corfioCode, `%${normalizedSearch}%`),
          ilike(clients.responsibleSeller, `%${normalizedSearch}%`),
        ),
      );
    }

    const results = await db
      .select()
      .from(clients)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    // Ordenação manual
    const sortedResults = results.sort((a, b) => {
      const valA = String(a[orderBy] || '')
        .trim()
        .toLowerCase();
      const valB = String(b[orderBy] || '')
        .trim()
        .toLowerCase();

      const startsWithNumberA = /^\d/.test(valA);
      const startsWithNumberB = /^\d/.test(valB);

      if (startsWithNumberA && !startsWithNumberB) return 1;
      if (!startsWithNumberA && startsWithNumberB) return -1;

      return order === 'asc'
        ? valA.localeCompare(valB, 'pt-BR', { sensitivity: 'base' })
        : valB.localeCompare(valA, 'pt-BR', { sensitivity: 'base' });
    });

    return NextResponse.json({ clients: sortedResults }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a busca. Tente novamente mais tarde.' },
      { status: 500 },
    );
  }
}
