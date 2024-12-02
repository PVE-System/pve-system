import { db } from '@/app/db';
import { NextRequest, NextResponse } from 'next/server';
import { tabsViewed } from '@/app/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const { clientId, tabName } = Object.fromEntries(
    request.nextUrl.searchParams,
  );
  const userId = request.cookies.get('userId')?.value; // Pegando o userId dos cookies

  if (!clientId || !userId || !tabName) {
    return NextResponse.json(
      { error: 'Client ID, User ID, and Tab Name are required' },
      { status: 400 },
    );
  }

  try {
    // Verifique se já existe um registro de visualização para este userId e clientId
    const existingViewed = await db
      .select()
      .from(tabsViewed)
      .where(
        and(
          eq(tabsViewed.clientId, Number(clientId)),
          eq(tabsViewed.userId, Number(userId)),
        ),
      )
      .execute();

    // Log para depuração
    console.log('Tab viewed request:', { clientId, tabName, userId });

    // Defina o campo de atualização com base na aba visualizada
    const updateData =
      tabName === 'sales'
        ? { salesTabViewedAt: new Date() }
        : tabName === 'comments'
          ? { commentsTabViewedAt: new Date() }
          : tabName === 'files'
            ? { filesTabViewedAt: new Date() }
            : tabName === 'salesQuotes' // Adicionando a lógica para salesQuotes
              ? { salesQuoteTabViewedAt: new Date() }
              : null;

    if (!updateData) {
      return NextResponse.json({ error: 'Invalid tab name' }, { status: 400 });
    }

    if (existingViewed.length > 0) {
      // Se já existe, atualize a data de visualização
      await db
        .update(tabsViewed)
        .set(updateData)
        .where(
          and(
            eq(tabsViewed.clientId, Number(clientId)),
            eq(tabsViewed.userId, Number(userId)),
          ),
        )
        .execute();

      console.log(`Updated viewed time for tab ${tabName} for user ${userId}`);
    } else {
      // Se não existe, insira um novo registro
      await db
        .insert(tabsViewed)
        .values({
          clientId: Number(clientId),
          userId: Number(userId),
          ...updateData,
        })
        .execute();

      console.log(
        `Inserted new viewed time for tab ${tabName} for user ${userId}`,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating viewed tab:', error);
    return NextResponse.json(
      { error: 'Failed to update viewed tab' },
      { status: 500 },
    );
  }
}
