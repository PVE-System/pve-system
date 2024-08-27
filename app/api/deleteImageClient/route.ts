import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function DELETE(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json(
      { error: 'Client ID not provided' },
      { status: 400 },
    );
  }

  const fileName = `clients/${clientId}/profile-image.jpg`;

  try {
    // Deletar a imagem existente
    await del(fileName);

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'An error occurred during the file deletion' },
      { status: 500 },
    );
  }
}
