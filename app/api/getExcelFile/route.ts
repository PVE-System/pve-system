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
      const lastModified = new Date().toISOString(); // Use uma data genérica, já que lastModified não está disponível

      return {
        url: file.url,
        date: lastModified,
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
