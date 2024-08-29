import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File; // Use File aqui, não Blob
  const folder = request.nextUrl.searchParams.get('folder');
  const fileName = file?.name || `file-${Date.now()}`; // Use file.name para o nome

  if (!file || !folder) {
    return NextResponse.json(
      { error: 'File or folder not provided' },
      { status: 400 },
    );
  }

  try {
    const { url } = await put(`${folder}/${fileName}`, file, {
      access: 'public',
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'An error occurred during the file upload' },
      { status: 500 },
    );
  }
}
