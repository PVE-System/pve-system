import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  const folder = request.nextUrl.searchParams.get('folder');
  const fileName = request.nextUrl.searchParams.get('fileName');

  if (!folder || !fileName) {
    return NextResponse.json(
      { error: 'Folder or file name not provided' },
      { status: 400 },
    );
  }

  try {
    // Construir o caminho completo para o arquivo no Blob Storage
    const filePath = `${folder}/${fileName}`;

    // Listar arquivos no caminho para encontrar a URL correta
    const { blobs } = await list({ prefix: filePath });

    const file = blobs.find((blob) => blob.url.includes(fileName));

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Retornar a URL pública do arquivo
    return NextResponse.json({ url: file.url });
  } catch (error) {
    console.error('Error fetching file URL:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the file URL' },
      { status: 500 },
    );
  }
}
