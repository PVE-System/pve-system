import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function DELETE(request: NextRequest) {
  const fileUrl = request.nextUrl.searchParams.get('fileName'); // Agora usando o URL completo

  if (!fileUrl) {
    return NextResponse.json(
      { error: 'File URL not provided' },
      { status: 400 },
    );
  }

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    await del(fileUrl, { token });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'An error occurred during the file deletion' },
      { status: 500 },
    );
  }
}
