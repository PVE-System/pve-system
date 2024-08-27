import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { clients } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as Blob;
  const fileName = request.nextUrl.searchParams.get('pathname');
  const clientId = request.nextUrl.searchParams.get('clientId');

  if (!file || !fileName || !clientId) {
    return NextResponse.json(
      { error: 'File, pathname or client ID not provided' },
      { status: 400 },
    );
  }

  try {
    const { url } = await put(fileName, file, {
      access: 'public',
    });

    // Atualiza a URL da imagem no banco de dados
    await db
      .update(clients)
      .set({ imageUrl: url })
      .where(eq(clients.id, Number(clientId)));

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'An error occurred during the file upload' },
      { status: 500 },
    );
  }
}
