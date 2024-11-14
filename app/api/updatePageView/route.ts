import { db } from '@/app/db';
import { pageViews } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const page = request.nextUrl.searchParams.get('page');

  if (!userId || !page) {
    return NextResponse.json(
      { error: 'User ID and page are required' },
      { status: 400 },
    );
  }

  const userIdNum = Number(userId);

  try {
    // Adicionando log para verificar a existência de um registro
    const existingView = await db
      .select()
      .from(pageViews)
      .where(eq(pageViews.userId, userIdNum))
      .execute();

    if (existingView.length > 0) {
      // Atualize se o registro já existir
      await db
        .update(pageViews)
        .set({ lastViewedAt: new Date() })
        .where(eq(pageViews.userId, userIdNum))
        .execute();
      console.log(`Updated last_viewed_at for user ${userId}`);
    } else {
      // Insere um novo registro apenas se ele não existir
      await db
        .insert(pageViews)
        .values({
          userId: userIdNum,
          pageExcel: new Date(),
          pageDashboard: new Date(),
          pageSalesQuote: new Date(),
          lastViewedAt: new Date(),
          lastUpdatedAt: new Date(),
        })
        .execute();
      console.log(`Inserted new page view entry for user ${userId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Tratando o erro como Error para acessar message
    if (error instanceof Error) {
      console.error('Error updating page view:', error.message);
      return NextResponse.json(
        { error: 'Failed to update page view', details: error.message },
        { status: 500 },
      );
    } else {
      console.error('Unexpected error:', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 },
      );
    }
  }
}
