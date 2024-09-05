import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesInformation, clients, users } from '@/app/db/schema';
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

    // Selecionar as informações de vendas com os campos atualizados
    const salesInfo = await db
      .select({
        clientId: salesInformation.clientId,
        commercial: salesInformation.commercial,
        commercialUpdatedAt: salesInformation.commercialUpdatedAt,
        commercialUpdatedBy: salesInformation.commercialUpdatedBy,
        marketing: salesInformation.marketing,
        marketingUpdatedAt: salesInformation.marketingUpdatedAt,
        marketingUpdatedBy: salesInformation.marketingUpdatedBy,
        invoicing: salesInformation.invoicing,
        invoicingUpdatedAt: salesInformation.invoicingUpdatedAt,
        invoicingUpdatedBy: salesInformation.invoicingUpdatedBy,
        cables: salesInformation.cables,
        cablesUpdatedAt: salesInformation.cablesUpdatedAt,
        cablesUpdatedBy: salesInformation.cablesUpdatedBy,
        financial: salesInformation.financial,
        financialUpdatedAt: salesInformation.financialUpdatedAt,
        financialUpdatedBy: salesInformation.financialUpdatedBy,
        invoice: salesInformation.invoice,
        invoiceUpdatedAt: salesInformation.invoiceUpdatedAt,
        invoiceUpdatedBy: salesInformation.invoiceUpdatedBy,
      })
      .from(salesInformation)
      .where(eq(salesInformation.clientId, Number(id)))
      .execute();

    if (salesInfo.length === 0) {
      return NextResponse.json(
        { error: 'Sales information not found' },
        { status: 404 },
      );
    }

    // Obter os IDs dos usuários responsáveis pelas atualizações, filtrando os que não são null
    const updatedByIds = [
      salesInfo[0].commercialUpdatedBy,
      salesInfo[0].marketingUpdatedBy,
      salesInfo[0].invoicingUpdatedBy,
      salesInfo[0].cablesUpdatedBy,
      salesInfo[0].financialUpdatedBy,
      salesInfo[0].invoiceUpdatedBy,
    ].filter((id) => id !== null) as number[]; // Converter para número

    if (updatedByIds.length === 0) {
      // Se não houver IDs de usuários válidos, retornar os dados sem tentar buscar nomes
      return NextResponse.json(salesInfo[0], { status: 200 });
    }

    // Obter os nomes dos usuários responsáveis pelas atualizações
    const userInfo = await db
      .select({ id: users.id, name: users.name }) // Aqui, corrigido para "name"
      .from(users)
      .where(inArray(users.id, updatedByIds)) // Usar inArray para pegar todos os usuários
      .execute();

    // Criar um mapeamento de userId para userName
    const userNameMap: { [key: number]: string } = {};
    userInfo.forEach((user) => {
      userNameMap[user.id] = user.name || 'Desconhecido'; // Garantir que o valor seja sempre string
    });

    // Combinar os dados e substituir os userId pelos userName
    const combinedData = {
      ...salesInfo[0],
      commercialUpdatedBy:
        userNameMap[salesInfo[0].commercialUpdatedBy as number] ||
        'Desconhecido',
      marketingUpdatedBy:
        userNameMap[salesInfo[0].marketingUpdatedBy as number] ||
        'Desconhecido',
      invoicingUpdatedBy:
        userNameMap[salesInfo[0].invoicingUpdatedBy as number] ||
        'Desconhecido',
      cablesUpdatedBy:
        userNameMap[salesInfo[0].cablesUpdatedBy as number] || 'Desconhecido',
      financialUpdatedBy:
        userNameMap[salesInfo[0].financialUpdatedBy as number] ||
        'Desconhecido',
      invoiceUpdatedBy:
        userNameMap[salesInfo[0].invoiceUpdatedBy as number] || 'Desconhecido',
    };

    return NextResponse.json(combinedData, { status: 200 });
  } catch (error) {
    console.error('Error fetching client data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client data' },
      { status: 500 },
    );
  }
}
