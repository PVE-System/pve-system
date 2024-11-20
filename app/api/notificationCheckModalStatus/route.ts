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
    const userView = await db
      .select()
      .from(pageViews)
      .where(eq(pageViews.userId, userIdNum))
      .execute();

    if (userView.length === 0) {
      return NextResponse.json({ hasModal: false });
    }

    const { pageExcelUpdatedAt, pageDashboardUpdatedAt } = userView[0];

    // Verifica se os campos necessários não são `null`
    if (!pageExcelUpdatedAt) {
      console.warn('pageExcelUpdatedAt is null for user ID:', userIdNum);
      return NextResponse.json({ hasModal: false });
    }

    // Modal é exibido quando pageDashboardUpdatedAt não foi atualizado para refletir pageExcelUpdatedAt
    const hasModal =
      !pageDashboardUpdatedAt || pageDashboardUpdatedAt < pageExcelUpdatedAt;

    console.log(
      `User ID ${userIdNum} - pageExcelUpdatedAt: ${pageExcelUpdatedAt}, pageDashboardUpdatedAt: ${pageDashboardUpdatedAt}, hasModal: ${hasModal}`,
    );

    return NextResponse.json({ hasModal });
  } catch (error) {
    console.error('Error checking modal status:', error);
    return NextResponse.json(
      { error: 'Failed to check modal status' },
      { status: 500 },
    );
  }
}
