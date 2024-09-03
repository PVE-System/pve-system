import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  const folder = request.nextUrl.searchParams.get('folder');

  if (!folder) {
    return NextResponse.json({ error: 'Folder not provided' }, { status: 400 });
  }

  try {
    const { blobs } = await list({ prefix: `${folder}/` });

    if (!blobs || blobs.length === 0) {
      return NextResponse.json({ files: [] }, { status: 200 });
    }

    const fileData = blobs.map((file) => {
      const fileName = file.url.split('/').pop();
      const uploadDate = new Date(file.uploadedAt).toISOString(); // Exemplo, assuma que pode haver uma maneira de obter a data real
      return {
        url: file.url,
        name: fileName,
        date: uploadDate, // Aqui você deve retornar a data associada ao arquivo
      };
    });

    return NextResponse.json({ files: fileData });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching files' },
      { status: 500 },
    );
  }
}
