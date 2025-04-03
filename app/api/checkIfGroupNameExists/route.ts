import { db } from '@/app/db';
import { NextResponse } from 'next/server';

// Apenas aceita requisições GET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name'); // Obtém o parâmetro "name"

  if (!name) {
    return NextResponse.json({ error: 'Nome não fornecido' }, { status: 400 });
  }

  try {
    // Verifica se o nome já existe no banco de dados
    const group = await db.query.businessGroups.findFirst({
      where: (group, { eq }) => eq(group.name, name),
    });

    return NextResponse.json({ exists: !!group }, { status: 200 });
  } catch (error) {
    console.error('Erro ao verificar nome do grupo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
