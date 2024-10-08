import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function DELETE(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('clientId');
  const imageUrl = request.nextUrl.searchParams.get('imageUrl'); // Pegando o imageUrl da query

  if (!clientId || !imageUrl) {
    return NextResponse.json(
      { error: 'Client ID or Image URL not provided' },
      { status: 400 },
    );
  }

  try {
    // Deletar a imagem existente usando a URL completa
    await del(imageUrl); // Usando a URL completa para deletar a imagem

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'An error occurred during the file deletion' },
      { status: 500 },
    );
  }
}
