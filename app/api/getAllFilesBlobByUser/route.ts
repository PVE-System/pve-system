import { NextResponse, NextRequest } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Lista os arquivos no Blob Storage associados ao ID do usuário
    const { blobs } = await list({ prefix: `users/id=${userId}/` });

    const files = blobs.map((blob) => ({ url: blob.url }));

    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 },
    );
  }
}
