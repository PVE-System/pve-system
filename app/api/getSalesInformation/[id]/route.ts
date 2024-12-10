import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesInformation, users } from '@/app/db/schema';
import { eq, inArray } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 },
    );
  }

  try {
    console.log('Fetching sales information for client ID:', id);

    // Definir o mapeamento de campos com tipos explícitos
    const fieldMapping = {
      commercial: 'commercial',
      marketing: 'marketing',
      invoicing: 'invoicing',
      cables: 'cables',
      financial: 'financial',
      invoice: 'invoice',
    } as const;

    type FieldKeys = keyof typeof fieldMapping;
    type UpdatedFields = `${FieldKeys}UpdatedBy` | `${FieldKeys}UpdatedAt`;

    type SalesInfoData = {
      clientId: number;
    } & {
      [key in FieldKeys | UpdatedFields]?: string | number | null;
    };

    // Selecionar todas as colunas relacionadas ao cliente
    const salesInfo = await db
      .select({
        clientId: salesInformation.clientId,
        ...Object.keys(fieldMapping).reduce(
          (acc, key) => {
            acc[key] = salesInformation[key as FieldKeys];
            acc[`${key}UpdatedAt` as UpdatedFields] =
              salesInformation[`${key}UpdatedAt` as UpdatedFields];
            acc[`${key}UpdatedBy` as UpdatedFields] =
              salesInformation[`${key}UpdatedBy` as UpdatedFields];
            return acc;
          },
          {} as Record<string, any>,
        ),
      })
      .from(salesInformation)
      .where(eq(salesInformation.clientId, Number(id)))
      .execute();

    if (salesInfo.length === 0) {
      // Retorna um objeto vazio ao invés de erro 404
      return NextResponse.json({}, { status: 200 });
    }

    const salesInfoData: SalesInfoData = salesInfo[0];

    // Obter os IDs dos usuários responsáveis pelas atualizações
    const updatedByIds = (Object.keys(fieldMapping) as FieldKeys[])
      .map((field) => salesInfoData[`${field}UpdatedBy` as UpdatedFields])
      .filter((id) => id !== null) as number[];

    const userInfo = updatedByIds.length
      ? await db
          .select({ id: users.id, name: users.name })
          .from(users)
          .where(inArray(users.id, updatedByIds))
          .execute()
      : [];

    // Mapeamento de ID do usuário para o nome
    const userNameMap: { [key: number]: string } = {};
    userInfo.forEach((user) => {
      userNameMap[user.id] = user.name || 'Desconhecido';
    });

    // Substituir IDs de usuários pelos nomes nos dados retornados
    (Object.keys(fieldMapping) as FieldKeys[]).forEach((field) => {
      const updatedByKey = `${field}UpdatedBy` as UpdatedFields;
      const updatedById = salesInfoData[updatedByKey] as number | null;
      salesInfoData[updatedByKey] =
        userNameMap[updatedById || 0] || 'Desconhecido';
    });

    return NextResponse.json(salesInfoData, { status: 200 });
  } catch (error) {
    console.error('Error fetching sales information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales information' },
      { status: 500 },
    );
  }
}
