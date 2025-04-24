import { NextRequest, NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const folder = request.nextUrl.searchParams.get('folder');

  if (!file || !folder) {
    return NextResponse.json(
      { error: 'File or folder not provided' },
      { status: 400 },
    );
  }

  try {
    const prefix = `${folder}/`; // Define o prefixo para buscar arquivos da pasta
    const existingFiles = await list({ prefix });

    // Se tiver 10 ou mais arquivos, deletar o mais antigo
    if (existingFiles.blobs.length >= 10) {
      // Ordenar por data de criação
      const sortedFiles = existingFiles.blobs.sort(
        (a, b) =>
          new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime(),
      );

      const oldestFile = sortedFiles[0];

      await del(oldestFile.url); // Deleta o arquivo mais antigo
      console.log(`Deleted oldest file: ${oldestFile.pathname}`);
    }

    const fileName = `${folder}/${file.name}`;

    const { url } = await put(fileName, file, {
      access: 'public',
    });

    const uploadDate = new Date().toISOString();

    return NextResponse.json({ url, date: uploadDate });
  } catch (error) {
    console.error('Error uploading quote file:', error);
    return NextResponse.json(
      { error: 'An error occurred during the quote file upload' },
      { status: 500 },
    );
  }
}
