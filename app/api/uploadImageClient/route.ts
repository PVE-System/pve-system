import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as Blob;
  const fileName = request.nextUrl.searchParams.get('pathname');

  if (!file || !fileName) {
    return NextResponse.json(
      { error: 'File or pathname not provided' },
      { status: 400 },
    );
  }

  try {
    const { url } = await put(fileName, file, {
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
