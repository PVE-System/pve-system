import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { visitRoutes, visitRouteClients } from '@/app/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { routeId, userId, routeName, scheduledDate, description, clients } =
      body;

    // Função auxiliar para converter string para Date de forma segura
    const safeDateConversion = (
      dateString: string | null | undefined,
    ): Date | null => {
      if (!dateString) return null;
      try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
      } catch {
        return null;
      }
    };

    // Validações básicas
    if (!routeId || !userId || !routeName || !scheduledDate || !clients) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 },
      );
    }

    // Verificar se a rota existe (removida restrição de propriedade para permitir colaboração)
    const existingRoute = await db
      .select()
      .from(visitRoutes)
      .where(eq(visitRoutes.id, parseInt(routeId)))
      .limit(1);

    if (existingRoute.length === 0) {
      return NextResponse.json(
        { error: 'Rota não encontrada' },
        { status: 404 },
      );
    }

    // Converter a data para o formato correto
    let formattedDate: Date;
    try {
      // Assumindo que a data vem no formato DD/MM/AAAA
      const [day, month, year] = scheduledDate.split('/');
      formattedDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
      );

      if (isNaN(formattedDate.getTime())) {
        throw new Error('Data inválida');
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Formato de data inválido. Use DD/MM/AAAA' },
        { status: 400 },
      );
    }

    // Buscar clientes existentes da rota para preservar seus status
    const existingRouteClients = await db
      .select({
        id: visitRouteClients.id,
        clientId: visitRouteClients.clientId,
        customerNameUnregistered: visitRouteClients.customerNameUnregistered,
        customerStateUnregistered: visitRouteClients.customerStateUnregistered,
        customerCityUnregistered: visitRouteClients.customerCityUnregistered,
        visitStatus: visitRouteClients.visitStatus,
        currentVisitDescription: visitRouteClients.currentVisitDescription,
        lastVisitDescription: visitRouteClients.lastVisitDescription,
        lastVisitConfirmedAt: visitRouteClients.lastVisitConfirmedAt,
      })
      .from(visitRouteClients)
      .where(eq(visitRouteClients.visitRouteId, parseInt(routeId)));

    // Criar um mapa para facilitar a busca dos status existentes
    const existingStatusMap = new Map();

    // Para clientes cadastrados, usar clientId como chave
    existingRouteClients.forEach((client) => {
      if (client.clientId) {
        existingStatusMap.set(client.clientId.toString(), {
          visitStatus: client.visitStatus,
          currentVisitDescription: client.currentVisitDescription,
          lastVisitDescription: client.lastVisitDescription,
          lastVisitConfirmedAt: client.lastVisitConfirmedAt,
        });
      }
    });

    // Para clientes não cadastrados, usar nome + estado + cidade como chave
    existingRouteClients.forEach((client) => {
      if (client.customerNameUnregistered) {
        const key = `${client.customerNameUnregistered}-${client.customerStateUnregistered}-${client.customerCityUnregistered}`;
        existingStatusMap.set(key, {
          visitStatus: client.visitStatus,
          currentVisitDescription: client.currentVisitDescription,
          lastVisitDescription: client.lastVisitDescription,
          lastVisitConfirmedAt: client.lastVisitConfirmedAt,
        });
      }
    });

    // Iniciar transação para atualizar rota e clientes
    await db.transaction(async (tx) => {
      // 1. Atualizar a rota
      await tx
        .update(visitRoutes)
        .set({
          routeName: routeName,
          scheduledDate: formattedDate,
          description: description,
          updatedAt: new Date(),
        })
        .where(eq(visitRoutes.id, parseInt(routeId)));

      // 2. Deletar todos os clientes existentes da rota
      await tx
        .delete(visitRouteClients)
        .where(eq(visitRouteClients.visitRouteId, parseInt(routeId)));

      // 3. Inserir os novos clientes preservando status existentes
      for (const client of clients) {
        if (client.clientId) {
          // Cliente cadastrado
          const existingData = existingStatusMap.get(
            client.clientId.toString(),
          );

          // Usar dados enviados pelo frontend se disponíveis, senão usar dados existentes
          const finalVisitStatus =
            client.visitStatus || existingData?.visitStatus || 'AGENDADO';
          const finalCurrentVisitDescription =
            client.currentVisitDescription ||
            existingData?.currentVisitDescription ||
            null;
          const finalLastVisitDescription =
            client.lastVisitDescription ||
            existingData?.lastVisitDescription ||
            null;
          // Converter lastVisitConfirmedAt para Date se for string
          const finalLastVisitConfirmedAt =
            safeDateConversion(client.lastVisitConfirmedAt) ||
            safeDateConversion(existingData?.lastVisitConfirmedAt);

          await tx.insert(visitRouteClients).values({
            visitRouteId: parseInt(routeId),
            clientId: parseInt(client.clientId),
            visitStatus: finalVisitStatus,
            currentVisitDescription: finalCurrentVisitDescription,
            lastVisitDescription: finalLastVisitDescription,
            lastVisitConfirmedAt: finalLastVisitConfirmedAt,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else if (client.customerNameUnregistered) {
          // Cliente não cadastrado
          const key = `${client.customerNameUnregistered}-${client.customerStateUnregistered || ''}-${client.customerCityUnregistered || ''}`;
          const existingData = existingStatusMap.get(key);

          // Usar dados enviados pelo frontend se disponíveis, senão usar dados existentes
          const finalVisitStatus =
            client.visitStatus || existingData?.visitStatus || 'AGENDADO';
          const finalCurrentVisitDescription =
            client.currentVisitDescription ||
            existingData?.currentVisitDescription ||
            null;
          const finalLastVisitDescription =
            client.lastVisitDescription ||
            existingData?.lastVisitDescription ||
            null;
          // Converter lastVisitConfirmedAt para Date se for string
          const finalLastVisitConfirmedAt =
            safeDateConversion(client.lastVisitConfirmedAt) ||
            safeDateConversion(existingData?.lastVisitConfirmedAt);

          await tx.insert(visitRouteClients).values({
            visitRouteId: parseInt(routeId),
            customerNameUnregistered: client.customerNameUnregistered,
            customerStateUnregistered: client.customerStateUnregistered || '',
            customerCityUnregistered: client.customerCityUnregistered || '',
            visitStatus: finalVisitStatus,
            currentVisitDescription: finalCurrentVisitDescription,
            lastVisitDescription: finalLastVisitDescription,
            lastVisitConfirmedAt: finalLastVisitConfirmedAt,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    });

    return NextResponse.json({
      message: 'Rota atualizada com sucesso',
      routeId: parseInt(routeId),
      updatedAt: new Date(),
    });
  } catch (error: unknown) {
    console.error('Erro ao atualizar rota de visita:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
