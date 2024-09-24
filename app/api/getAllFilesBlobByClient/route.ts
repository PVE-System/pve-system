/* import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob'; // Supondo que esteja usando o Vercel Blob

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json(
      { error: 'Client ID not provided' },
      { status: 400 },
    );
  }

  try {
    // Listando arquivos nas pastas com prefixos
    const clientFiles = await list({ prefix: `clients/${clientId}/` });
    const balanceSheetFiles = await list({
      prefix: `BalanceSheet/id=${clientId}/`,
    });
    const shipmentReportFiles = await list({
      prefix: `ShipmentReport/id=${clientId}/`,
    });

    // O retorno de 'list' deve ser verificado para o que está disponível
    const allFiles = [
      ...(clientFiles.blobs || []),
      ...(balanceSheetFiles.blobs || []),
      ...(shipmentReportFiles.blobs || []),
    ];

    if (allFiles.length === 0) {
      return NextResponse.json(
        { message: 'No files found for client' },
        { status: 404 },
      );
    }

    // Retorna a lista de arquivos
    return NextResponse.json({ files: allFiles });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 },
    );
  }
}
 */

import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json(
      { error: 'Client ID not provided' },
      { status: 400 },
    );
  }

  try {
    // Listando arquivos na pasta do cliente, BalanceSheet e ShipmentReport
    const clientFiles = await list({ prefix: `clients/id=${clientId}/` }); // Verifique se o prefix está correto
    const balanceSheetFiles = await list({
      prefix: `BalanceSheet/id=${clientId}/`,
    });
    const shipmentReportFiles = await list({
      prefix: `ShipmentReport/id=${clientId}/`,
    });

    // Combinar todos os arquivos
    const allFiles = [
      ...(clientFiles.blobs || []),
      ...(balanceSheetFiles.blobs || []),
      ...(shipmentReportFiles.blobs || []),
    ];

    if (allFiles.length === 0) {
      return NextResponse.json(
        { message: 'No files found for client' },
        { status: 404 },
      );
    }

    // Retorna a lista de arquivos
    return NextResponse.json({ files: allFiles });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 },
    );
  }
}
