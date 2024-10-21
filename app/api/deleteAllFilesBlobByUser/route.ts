import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function DELETE(request: NextRequest) {
  try {
    // Extrair o corpo da requisição
    const { fileUrls } = await request.json();

    if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
      return NextResponse.json(
        { error: 'No file URLs provided' },
        { status: 400 },
      );
    }

    // Deletar cada arquivo pela URL fornecida
    for (const fileUrl of fileUrls) {
      await del(fileUrl);
    }

    return NextResponse.json({ message: 'All files deleted successfully' });
  } catch (error) {
    console.error('Error deleting files:', error);
    return NextResponse.json(
      { error: 'Failed to delete files' },
      { status: 500 },
    );
  }
}
