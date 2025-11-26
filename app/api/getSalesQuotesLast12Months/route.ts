export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db/db';
import { salesQuotes, clients, users } from '@/app/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';

// Retorna totais de cotações agrupados por mês nos últimos 12 meses
// Opcionalmente filtra por clientId se informado na querystring
// Filtra por operatorNumber se o usuário for "vendedor externo"
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientIdParam = searchParams.get('clientId');

    // Buscar role e userId dos cookies
    const userRole = request.cookies.get('role')?.value;
    const userId = request.cookies.get('userId')?.value;

    const now = new Date();
    // início do mês atual
    const startOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    // Início da janela no mesmo mês do ano anterior (ex.: Nov/prev → Nov/atual)
    // Isso gera 13 pontos: do mês equivalente do ano anterior até o mês atual
    const startWindow = new Date(startOfCurrentMonth);
    startWindow.setMonth(startWindow.getMonth() - 12);

    // Construir condições WHERE
    const whereConditions = [gte(salesQuotes.date, startWindow)];

    // Filtro para vendedor externo - sempre aplicar primeiro
    let operatorNumber: string | null = null;
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

      operatorNumber = user[0].operatorNumber;
    }

    // Filtro por clientId se informado
    if (clientIdParam) {
      whereConditions.push(eq(salesQuotes.clientId, Number(clientIdParam)));
    }

    // Construir query base
    const baseQuery = db
      .select({
        year: sql<number>`EXTRACT(YEAR FROM ${salesQuotes.date})::int`,
        month: sql<number>`EXTRACT(MONTH FROM ${salesQuotes.date})::int`,
        total: sql<number>`COUNT(${salesQuotes.id})::int`,
        totalSuccess: sql<number>`COUNT(CASE WHEN ${salesQuotes.quotesSuccess} = true THEN 1 END)::int`,
      })
      .from(salesQuotes);

    // Se for vendedor externo, fazer JOIN com clients para filtrar por operatorNumber
    let rows;
    if (operatorNumber) {
      const baseWhere = and(...whereConditions);
      rows = await baseQuery
        .innerJoin(clients, eq(salesQuotes.clientId, clients.id))
        .where(and(baseWhere, eq(clients.responsibleSeller, operatorNumber)))
        .groupBy(
          sql`EXTRACT(YEAR FROM ${salesQuotes.date})`,
          sql`EXTRACT(MONTH FROM ${salesQuotes.date})`,
        )
        .orderBy(
          sql`EXTRACT(YEAR FROM ${salesQuotes.date})`,
          sql`EXTRACT(MONTH FROM ${salesQuotes.date})`,
        );
    } else {
      const baseWhere = and(...whereConditions);
      rows = await baseQuery
        .where(baseWhere)
        .groupBy(
          sql`EXTRACT(YEAR FROM ${salesQuotes.date})`,
          sql`EXTRACT(MONTH FROM ${salesQuotes.date})`,
        )
        .orderBy(
          sql`EXTRACT(YEAR FROM ${salesQuotes.date})`,
          sql`EXTRACT(MONTH FROM ${salesQuotes.date})`,
        );
    }

    // Normalizar para garantir 13 pontos (mês equivalente do ano anterior até o mês atual)
    const monthLabelsPt = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    const keyToTotal = new Map<string, number>();
    const keyToTotalSuccess = new Map<string, number>();
    rows.forEach((r) => {
      const ymKey = `${String(r.year)}-${String(r.month).padStart(2, '0')}`;
      keyToTotal.set(ymKey, r.total);
      keyToTotalSuccess.set(ymKey, r.totalSuccess);
    });

    const series = [] as {
      label: string;
      count: number;
      countSuccess: number;
    }[];
    for (let i = 0; i <= 12; i++) {
      const d = new Date(
        startWindow.getFullYear(),
        startWindow.getMonth() + i,
        1,
      );
      const ymKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `${monthLabelsPt[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`;
      series.push({
        label,
        count: keyToTotal.get(ymKey) ?? 0,
        countSuccess: keyToTotalSuccess.get(ymKey) ?? 0,
      });
    }

    return NextResponse.json({ success: true, data: series });
  } catch (error) {
    console.error('Erro ao obter totais últimos 12 meses:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno ao obter totais últimos 12 meses',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 },
    );
  }
}
