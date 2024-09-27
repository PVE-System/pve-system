//notificationCheckUpdate

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesInformation, comments, tabsViewed } from '@/app/db/schema';
import { eq, and, gt, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('clientId');
  const userId = request.nextUrl.searchParams.get('userId');

  if (!clientId || !userId) {
    return NextResponse.json(
      { error: 'Client ID and User ID are required' },
      { status: 400 },
    );
  }

  try {
    // Obter última visualização do usuário
    const lastViewed = await db
      .select()
      .from(tabsViewed)
      .where(
        and(
          eq(tabsViewed.clientId, Number(clientId)),
          eq(tabsViewed.userId, Number(userId)),
        ),
      )
      .execute();

    const lastSalesViewed =
      lastViewed.length > 0 ? lastViewed[0].salesTabViewedAt : null;
    const lastCommentsViewed =
      lastViewed.length > 0 ? lastViewed[0].commentsTabViewedAt : null;

    // Verificar atualizações na aba de vendas (com múltiplos campos de atualização)
    const salesChanges = await db
      .select()
      .from(salesInformation)
      .where(
        and(
          eq(salesInformation.clientId, Number(clientId)),
          or(
            gt(
              salesInformation.commercialUpdatedAt,
              lastSalesViewed || new Date(0),
            ),
            gt(
              salesInformation.marketingUpdatedAt,
              lastSalesViewed || new Date(0),
            ),
            gt(
              salesInformation.invoicingUpdatedAt,
              lastSalesViewed || new Date(0),
            ),
            gt(
              salesInformation.cablesUpdatedAt,
              lastSalesViewed || new Date(0),
            ),
            gt(
              salesInformation.financialUpdatedAt,
              lastSalesViewed || new Date(0),
            ),
            gt(
              salesInformation.invoiceUpdatedAt,
              lastSalesViewed || new Date(0),
            ),
          ),
        ),
      )
      .execute();

    // Verificar atualizações na aba de comentários
    const commentChanges = await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.clientId, Number(clientId)),
          gt(comments.createdAt, lastCommentsViewed || new Date(0)),
        ),
      )
      .execute();

    // Se houver mudanças, retornar uma notificação
    return NextResponse.json({
      salesTabChanged: salesChanges.length > 0,
      commentsTabChanged: commentChanges.length > 0,
    });
  } catch (error) {
    console.error('Erro ao verificar as atualizações:', error);
    return NextResponse.json(
      { error: 'Failed to check for updates' },
      { status: 500 },
    );
  }
}
