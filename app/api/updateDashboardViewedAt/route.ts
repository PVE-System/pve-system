import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { pageViews } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  console.log('PUT request received at /api/updateDashboardViewedAt');

  const userId = request.nextUrl.searchParams.get('userId');
  console.log('User ID received:', userId);

  if (!userId) {
    console.error('User ID is missing from request');
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const userIdNum = Number(userId);
  console.log('Parsed User ID:', userIdNum);

  try {
    // Verifica se o registro existe
    const existingRecord = await db
      .select()
      .from(pageViews)
      .where(eq(pageViews.userId, userIdNum))
      .execute();

    if (existingRecord.length === 0) {
      console.warn(`No record found for user ID ${userIdNum}, creating one...`);
      // Cria um novo registro se não existir
      await db
        .insert(pageViews)
        .values({
          userId: userIdNum,
          pageDashboard: new Date(),
        })
        .execute();
      console.log(`New record created for user ID ${userIdNum}`);
    } else {
      console.log(`Record exists for user ID ${userIdNum}, updating...`);
      // Atualiza o registro existente
      const result = await db
        .update(pageViews)
        .set({ pageDashboard: new Date() })
        .where(eq(pageViews.userId, userIdNum))
        .execute();

      console.log('Database update result:', result);

      // Presuma sucesso, já que a operação foi executada sem erros
      console.log(
        `Successfully updated pageDashboard for user ID ${userIdNum} (assumed success)`,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar page_dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to update page_dashboard' },
      { status: 500 },
    );
  }
}
