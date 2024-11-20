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
      return NextResponse.json({ hasBadge: false });
    }

    const { pageExcel, pageExcelUpdatedAt } = userView[0];

    // Verifica se os campos necessários não são `null`
    if (!pageExcel || !pageExcelUpdatedAt) {
      console.warn(
        'pageExcel or pageExcelUpdatedAt is null for user ID:',
        userIdNum,
      );
      return NextResponse.json({ hasBadge: false });
    }

    // Badge é exibido enquanto pageExcelUpdatedAt > pageExcel
    const hasBadge = pageExcelUpdatedAt > pageExcel;

    console.log(
      `User ID ${userIdNum} - pageExcel: ${pageExcel}, pageExcelUpdatedAt: ${pageExcelUpdatedAt}, hasBadge: ${hasBadge}`,
    );

    return NextResponse.json({ hasBadge });
  } catch (error) {
    console.error('Error checking badge status:', error);
    return NextResponse.json(
      { error: 'Failed to check badge status' },
      { status: 500 },
    );
  }
}
