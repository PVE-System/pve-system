export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const occurrenceId = searchParams.get('occurrenceId');

    if (!occurrenceId) {
      return NextResponse.json(
        { error: 'ID da ocorrência não fornecido' },
        { status: 400 },
      );
    }

    // Lista todos os blobs
    const { blobs } = await list();

    // Filtra apenas os blobs da pasta frequentOccurrences e do ID específico
    const files = blobs
      .filter(
        (blob) =>
          blob.pathname.startsWith('frequentOccurrences/') &&
          blob.pathname.includes(`id=${occurrenceId}`),
      )
      .map((blob) => ({
        url: blob.url,
        name: blob.pathname.split('/').pop() || '',
        date: blob.uploadedAt,
      }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Erro ao buscar arquivos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar arquivos' },
      { status: 500 },
    );
  }
}
