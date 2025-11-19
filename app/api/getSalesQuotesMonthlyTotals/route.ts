export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db/db';
import { salesQuotes } from '@/app/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientIdParam = searchParams.get('clientId');
    const yearParam = searchParams.get('year');

    if (!clientIdParam || !yearParam) {
      return NextResponse.json(
        { success: false, message: 'Parâmetros obrigatórios: clientId, year' },
        { status: 400 },
      );
    }

    const clientId = Number(clientIdParam);
    const year = Number(yearParam);
    if (Number.isNaN(clientId) || Number.isNaN(year)) {
      return NextResponse.json(
        { success: false, message: 'Parâmetros inválidos: clientId, year' },
        { status: 400 },
      );
    }

    // Buscar totais por mês para o ano e cliente informados
    // Usamos EXTRACT(MONTH FROM date) para agrupar por mês baseado em sales_quotes.date
    const results = await db
      .select({
        month: sql<number>`EXTRACT(MONTH FROM ${salesQuotes.date})::int`,
        total: sql<number>`COUNT(${salesQuotes.id})::int`,
        totalSuccess: sql<number>`COUNT(CASE WHEN ${salesQuotes.quotesSuccess} = true THEN 1 END)::int`,
      })
      .from(salesQuotes)
      .where(
        and(eq(salesQuotes.clientId, clientId), eq(salesQuotes.year, year)),
      )
      .groupBy(sql`EXTRACT(MONTH FROM ${salesQuotes.date})`)
      .orderBy(sql`1`);

    // Normalizar para 12 meses (1..12)
    const monthToTotal = new Map<number, number>();
    const monthToTotalSuccess = new Map<number, number>();
    for (const row of results) {
      monthToTotal.set(row.month, row.total);
      monthToTotalSuccess.set(row.month, row.totalSuccess);
    }

    const data = Array.from({ length: 12 }, (_, idx) => {
      const monthNumber = idx + 1;
      return {
        month: monthNumber,
        total: monthToTotal.get(monthNumber) ?? 0,
        totalSuccess: monthToTotalSuccess.get(monthNumber) ?? 0,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao obter totais mensais de cotações:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno ao obter totais mensais de cotações',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 },
    );
  }
}
