import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

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
    const fileName = `${folder}/${file.name}`;
    const { url } = await put(fileName, file, {
      access: 'public',
    });

    // Capturar a data de upload
    const uploadDate = new Date().toISOString();

    return NextResponse.json({ url, date: uploadDate });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'An error occurred during the file upload' },
      { status: 500 },
    );
  }
}
