/* import { db } from '@/app/db';
import { pageViews } from '@/app/db/schema';
import { eq, gt } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const userIdNum = Number(userId);

  try {
    // Busca o registro do usuário para obter as datas
    const userView = await db
      .select()
      .from(pageViews)
      .where(eq(pageViews.userId, userIdNum))
      .execute();

    if (userView.length === 0) {
      return NextResponse.json({ hasNotification: false });
    }

    const { lastViewedAt, pageExcel } = userView[0];

    // Comparação para ver se há uma notificação para o usuário
    const hasNotification =
      pageExcel && lastViewedAt && pageExcel > lastViewedAt;

    return NextResponse.json({ hasNotification });
  } catch (error) {
    console.error('Error checking for notifications:', error);
    return NextResponse.json(
      { error: 'Failed to check for notifications' },
      { status: 500 },
    );
  }
}
 */

import { db } from '@/app/db';
import { pageViews } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const userIdNum = Number(userId);

  try {
    // Busca o registro do usuário para obter as datas
    const userView = await db
      .select()
      .from(pageViews)
      .where(eq(pageViews.userId, userIdNum))
      .execute();

    if (userView.length === 0) {
      console.log(`No page view record found for user ID ${userIdNum}`);
      return NextResponse.json({ hasNotification: false });
    }

    const { pageDashboard, pageExcel } = userView[0];

    // Se `pageExcel` ou `pageDashboard` estiverem ausentes, não há notificação
    if (!pageExcel || !pageDashboard) {
      console.log('Missing date fields for user ID:', userIdNum);
      return NextResponse.json({ hasNotification: false });
    }

    // Verifica se a planilha foi atualizada após a última visualização do Dashboard
    const hasNotification = pageExcel > pageDashboard;

    console.log(
      `User ID ${userIdNum} - pageExcel: ${pageExcel}, pageDashboard: ${pageDashboard}, hasNotification: ${hasNotification}`,
    );

    return NextResponse.json({ hasNotification });
  } catch (error) {
    console.error('Error checking for notifications:', error);
    return NextResponse.json(
      { error: 'Failed to check for notifications' },
      { status: 500 },
    );
  }
}
