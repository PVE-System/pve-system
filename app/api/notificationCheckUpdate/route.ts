import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesInformation, comments, tabsViewed } from '@/app/db/schema';
import { eq, and, gt, or } from 'drizzle-orm';
import { list } from '@vercel/blob';

// Função para buscar arquivos diretamente do blob storage
async function fetchFilesDirectlyFromStorage(folder: string): Promise<any[]> {
  try {
    const { blobs } = await list({ prefix: `${folder}/` });

    if (!blobs || blobs.length === 0) {
      return [];
    }

    return blobs.map((file) => ({
      url: file.url,
      name: file.url.split('/').pop(), // Extraindo o nome do arquivo
      date: new Date(file.uploadedAt).toISOString(), // Data de upload do arquivo
    }));
  } catch (error) {
    console.error('Error fetching files from storage:', error);
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
    const lastFilesViewed =
      lastViewed.length > 0 ? lastViewed[0].filesTabViewedAt : null; // Verifica última visualização da aba de arquivos

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

    // Verificar atualizações nos arquivos da aba "Arquivos e anexos"
    const balanceFiles = await fetchFilesDirectlyFromStorage(
      `BalanceSheet/id=${clientId}`,
    );
    const shipmentFiles = await fetchFilesDirectlyFromStorage(
      `ShipmentReport/id=${clientId}`,
    );
    const allFiles = [...balanceFiles, ...shipmentFiles];

    // Se não houver arquivos, marca filesTabChanged como false
    let filesTabChanged = false;
    if (allFiles.length) {
      // Ordena os arquivos por data e obtém a mais recente
      const mostRecentFileDate = new Date(
        allFiles.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )[0].date,
      );

      // Verifica se há arquivos mais recentes que a última visualização
      filesTabChanged =
        mostRecentFileDate !== null &&
        (!lastFilesViewed || mostRecentFileDate > new Date(lastFilesViewed));
    }

    // Retorna a resposta incluindo o estado de todas as abas
    return NextResponse.json({
      salesTabChanged: salesChanges.length > 0,
      commentsTabChanged: commentChanges.length > 0,
      filesTabChanged,
    });
  } catch (error) {
    console.error('Erro ao verificar as atualizações:', error);
    return NextResponse.json(
      { error: 'Failed to check for updates' },
      { status: 500 },
    );
  }
}
