import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const { imageUrl } = await request.json(); // Recebe a URL da imagem a ser deletada

  if (!userId || !imageUrl) {
    return NextResponse.json(
      { error: 'User ID or image URL not provided' },
      { status: 400 },
    );
  }

  try {
    // Deletar a imagem existente
    await del(imageUrl); // Deleta a imagem do storage pelo URL

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'An error occurred during the file deletion' },
      { status: 500 },
    );
  }
}
