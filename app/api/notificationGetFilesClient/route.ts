import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { tabsViewed } from '@/app/db/schema';
import { eq, and } from 'drizzle-orm';

import { list } from '@vercel/blob'; // Mova a lógica diretamente

// Função para buscar arquivos do storage diretamente
async function fetchFilesFromStorage(folder: string): Promise<any[]> {
  try {
    const { blobs } = await list({ prefix: `${folder}/` });

    if (!blobs || blobs.length === 0) {
      return [];
    }

    return blobs.map((file) => {
      const fileName = file.url.split('/').pop();
      const uploadDate = new Date(file.uploadedAt).toISOString();
      return {
        url: file.url,
        name: fileName,
        date: uploadDate,
      };
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
}

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
    // Obter a última visualização da aba de arquivos
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

    const lastFilesViewed =
      lastViewed.length > 0 ? lastViewed[0].filesTabViewedAt : null;

    // Use a função para buscar arquivos diretamente
    const balanceFiles = await fetchFilesFromStorage(
      `BalanceSheet/id=${clientId}`,
    );
    const shipmentFiles = await fetchFilesFromStorage(
      `ShipmentReport/id=${clientId}`,
    );

    // Combina todos os arquivos das duas pastas
    const allFiles = [...balanceFiles, ...shipmentFiles];

    // Se não houver arquivos, define filesTabChanged como false
    if (!allFiles.length) {
      return NextResponse.json({
        filesTabChanged: false, // Sem arquivos, sem mudanças
      });
    }

    // Ordena os arquivos por data e obtém o mais recente
    const mostRecentFileDate = new Date(
      allFiles.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0].date,
    );

    console.log('Most recent file date:', mostRecentFileDate);

    // Verifica se há arquivos mais recentes que a última visualização
    const filesTabChanged = lastFilesViewed
      ? mostRecentFileDate > new Date(lastFilesViewed)
      : true; // Se o usuário nunca visualizou, considera como mudança

    return NextResponse.json({
      filesTabChanged, // Notificação para a aba de arquivos
    });
  } catch (error) {
    console.error('Error checking file updates:', error);
    return NextResponse.json(
      { error: 'Failed to check for file updates' },
      { status: 500 },
    );
  }
}
