import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get('fileName'); // Nome completo do arquivo
  const folder = request.nextUrl.searchParams.get('folder'); // Pasta onde o arquivo está

  if (!fileName || !folder) {
    return NextResponse.json(
      { error: 'File name or folder not provided' },
      { status: 400 },
    );
  }

  try {
    const { blobs } = await list({ prefix: `${folder}/` });

    // Extraia o hash do fileName recebido na requisição
    const fileHash = fileName.split('-').pop();

    // Encontre o blob que contém o hash na URL
    const file = blobs.find((blob) => {
      const blobUrlParts = blob.url.split('/');
      const blobFileName = blobUrlParts[blobUrlParts.length - 1];
      return blobFileName.includes(fileHash || '');
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ url: file.url }, { status: 200 });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the file' },
      { status: 500 },
    );
  }
}
