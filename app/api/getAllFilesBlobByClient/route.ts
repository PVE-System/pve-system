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
    // Listando arquivos nas novas pastas para o cliente
    const clientFiles = await list({ prefix: `clients/id=${clientId}/` });
    const fiscalDocsFiles = await list({
      prefix: `fiscalDocs/id=${clientId}/`,
    });
    const accountingDocsFiles = await list({
      prefix: `accountingDocs/id=${clientId}/`,
    });
    const socialContractFiles = await list({
      prefix: `socialContract/id=${clientId}/`,
    });

    // Combinar todos os arquivos das pastas atualizadas
    const allFiles = [
      ...(clientFiles.blobs || []),
      ...(fiscalDocsFiles.blobs || []),
      ...(accountingDocsFiles.blobs || []),
      ...(socialContractFiles.blobs || []),
    ];

    if (allFiles.length === 0) {
      return NextResponse.json(
        { message: 'No files found for client' },
        { status: 404 },
      );
    }

    // Retorna a lista de arquivos combinados de todas as pastas
    return NextResponse.json({ files: allFiles });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 },
    );
  }
}
