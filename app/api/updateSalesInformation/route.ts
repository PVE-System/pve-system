import { NextRequest, NextResponse } from 'next/server';
import { salesInformation, users } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

// Função para extrair o userId dos cookies
const getUserIdFromCookies = (request: NextRequest): number | null => {
  const cookies = request.cookies;
  const userId = cookies.get('userId')?.value;

  return userId ? Number(userId) : null;
};

// Mapear os nomes dos campos para suas colunas no banco de dados
const fieldMapping: { [key: string]: keyof typeof salesInformation } = {
  commercial: 'commercial',
  marketing: 'marketing',
  invoicing: 'invoicing',
  cables: 'cables',
  financial: 'financial',
  invoice: 'invoice',
};

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id');

  if (!clientId) {
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 },
    );
  }

  const clientIdNumber = Number(clientId);
  const userId = getUserIdFromCookies(request);

  if (isNaN(clientIdNumber) || !userId) {
    return NextResponse.json(
      { error: 'Invalid Client ID or User ID' },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const fieldName = Object.keys(body)[0] as string; // O nome do campo que está sendo atualizado
    const fieldValue = body[fieldName]?.trim(); // Remover espaços em branco

    // Verificar se o valor é válido (não vazio)
    if (!fieldValue) {
      return NextResponse.json(
        { error: 'Field value is required' },
        { status: 400 },
      );
    }

    // Verificar se o campo é válido
    const dbColumn = fieldMapping[fieldName];
    if (!dbColumn) {
      return NextResponse.json(
        { error: 'Invalid field name' },
        { status: 400 },
      );
    }

    // Obter o nome do usuário
    const user = await db
      .select({ userName: users.name })
      .from(users)
      .where(eq(users.id, userId))
      .execute();

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: any = {
      [dbColumn]: fieldValue || '', // Se o campo estiver em branco, definir uma string vazia
    };

    // Definir as chaves para `UpdatedBy` e `UpdatedAt` dinamicamente
    updateData[`${fieldName}UpdatedBy`] = userId;
    updateData[`${fieldName}UpdatedAt`] = new Date();

    // Atualizar o campo específico
    const updatedSalesInfo = await db
      .update(salesInformation)
      .set(updateData)
      .where(eq(salesInformation.clientId, clientIdNumber))
      .returning({
        updatedAt: salesInformation.updatedAt,
        userId: salesInformation.userId,
      })
      .execute();

    if (updatedSalesInfo.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update sales information' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      updatedAt: updatedSalesInfo[0].updatedAt, // Retornar a data de atualização
      userName: user[0].userName, // Nome do usuário para renderizar no frontend
    });
  } catch (error) {
    console.error('Error updating field:', error);
    return NextResponse.json(
      { error: 'Failed to update field' },
      { status: 500 },
    );
  }
}
