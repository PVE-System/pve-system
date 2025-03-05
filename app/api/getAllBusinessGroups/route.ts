import { db } from '@/app/db';
import { businessGroups, BusinessGroup } from '@/app/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache'; // Importar a função de revalidação

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os grupos empresariais no banco de dados
    const allBusinessGroups: BusinessGroup[] = await db
      .select()
      .from(businessGroups);

    // Revalidar a tag 'businessGroups' para garantir que o cache seja atualizado
    revalidateTag('businessGroups');

    // Criar a resposta JSON com a lista de grupos empresariais
    return NextResponse.json({ businessGroups: allBusinessGroups });
  } catch (error) {
    console.error('Erro ao buscar grupos empresariais:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar grupos empresariais' },
      { status: 500 },
    );
  }
}
