/* import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { pageViews } from '@/app/db/schema';
import { list } from '@vercel/blob';
import { eq } from 'drizzle-orm';

// Função para buscar a data mais recente do último arquivo no blob storage
async function fetchLatestExcelFileDate(): Promise<Date | null> {
  try {
    const { blobs } = await list({ prefix: 'ExcelSalesSpreadsheet/' });
    if (!blobs || blobs.length === 0) {
      return null;
    }

    const latestFile = blobs.reduce((latest, file) => {
      const fileDate = new Date(file.uploadedAt);
      return fileDate > latest ? fileDate : latest;
    }, new Date(0));

    return latestFile;
  } catch (error) {
    console.error('Error fetching files from storage:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Obter a última visualização do usuário na página
    const lastViewedRecord = await db
      .select()
      .from(pageViews)
      .where(eq(pageViews.userId, Number(userId)))
      .execute();

    const lastViewedAt =
      lastViewedRecord.length > 0 ? lastViewedRecord[0].lastViewedAt : null;

    // Obter a data do arquivo mais recente na pasta ExcelSalesSpreadsheet
    const latestExcelFileDate = await fetchLatestExcelFileDate();

    // Comparação da última visualização com o arquivo mais recente
    const excelPageTabChanged =
      latestExcelFileDate && lastViewedAt
        ? latestExcelFileDate.getTime() > new Date(lastViewedAt).getTime()
        : !!latestExcelFileDate;

    return NextResponse.json({
      excelPageTabChanged,
    });
  } catch (error) {
    console.error('Error checking notification updates:', error);
    return NextResponse.json(
      { error: 'Failed to check notification updates' },
      { status: 500 },
    );
  }
}
 */

import { db } from '@/app/db';
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
