import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function DELETE(request: NextRequest) {
  const fileUrl = request.nextUrl.searchParams.get('fileUrl');

  if (!fileUrl) {
    console.error('File URL not provided');
    return NextResponse.json(
      { error: 'File URL not provided' },
      { status: 400 },
    );
  }

  try {
    console.log(`Attempting to delete file at URL: ${fileUrl}`);

    // Deletar o arquivo diretamente usando a URL completa
    await del(fileUrl);

    console.log(`File deleted successfully at URL: ${fileUrl}`);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);

    return NextResponse.json(
      { error: 'An error occurred during the file deletion' },
      { status: 500 },
    );
  }
}
