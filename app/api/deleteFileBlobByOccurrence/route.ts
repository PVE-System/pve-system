import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function DELETE(request: NextRequest) {
  try {
    const { fileUrls } = await request.json();

    if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
      return NextResponse.json(
        { error: 'URLs dos arquivos não fornecidas' },
        { status: 400 },
      );
    }

    // Deletar todos os arquivos em paralelo
    await Promise.all(fileUrls.map((fileUrl) => del(fileUrl)));

    return NextResponse.json({ message: 'Arquivos deletados com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar arquivos:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar arquivos' },
      { status: 500 },
    );
  }
}
