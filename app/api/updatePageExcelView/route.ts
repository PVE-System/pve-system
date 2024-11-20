import { db } from '@/app/db';
import { pageViews } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  console.log('PUT request received at /api/updatePageExcelView');

  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const userIdNum = Number(userId);

  try {
    // Atualiza `page_excel` com o valor de `page_excel_updated_at`
    const result = await db
      .update(pageViews)
      .set({ pageExcel: new Date() })
      .where(eq(pageViews.userId, userIdNum))
      .execute();

    console.log(
      `Synced pageExcel with pageExcelUpdatedAt for user ID ${userIdNum}`,
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing pageExcel:', error);
    return NextResponse.json(
      { error: 'Failed to sync pageExcel' },
      { status: 500 },
    );
  }
}
