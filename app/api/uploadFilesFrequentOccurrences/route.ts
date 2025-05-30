import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const occurrenceId = request.nextUrl.searchParams.get('occurrenceId');

  if (!file || !occurrenceId) {
    return NextResponse.json(
      { error: 'File or occurrence ID not provided' },
      { status: 400 },
    );
  }

  try {
    const fileName = `frequentOccurrences/id=${occurrenceId}/${file.name}`;
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
