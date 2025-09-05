import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { visitRoutes, visitRouteClients } from '@/app/db/schema';
import { eq, and, not, inArray } from 'drizzle-orm';

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

    // Converter a data para o formato correto em UTC
    let formattedDate: Date;
    try {
      // Assumindo que a data vem no formato DD/MM/AAAA
      const [day, month, year] = scheduledDate.split('/');
      formattedDate = new Date(
        Date.UTC(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          0,
          0,
          0,
          0,
        ),
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

      // 2. Buscar clientes existentes para preservar IDs
      const existingClients = await tx
        .select({
          id: visitRouteClients.id,
          clientId: visitRouteClients.clientId,
          customerNameUnregistered: visitRouteClients.customerNameUnregistered,
          customerStateUnregistered:
            visitRouteClients.customerStateUnregistered,
          customerCityUnregistered: visitRouteClients.customerCityUnregistered,
        })
        .from(visitRouteClients)
        .where(eq(visitRouteClients.visitRouteId, parseInt(routeId)));

      // 3. Criar mapa para mapear clientes existentes com novos dados
      const clientMapping = new Map();

      // Para clientes cadastrados
      clients.forEach((client: any, index: number) => {
        if (client.clientId) {
          const existingClient = existingClients.find(
            (ec) => ec.clientId === parseInt(client.clientId),
          );
          if (existingClient) {
            clientMapping.set(existingClient.id, {
              ...client,
              orderIndex: index + 1,
            });
          }
        }
      });

      // Para clientes não cadastrados
      clients.forEach((client: any, index: number) => {
        if (client.customerNameUnregistered) {
          const existingClient = existingClients.find(
            (ec) =>
              ec.customerNameUnregistered === client.customerNameUnregistered &&
              ec.customerStateUnregistered ===
                client.customerStateUnregistered &&
              ec.customerCityUnregistered === client.customerCityUnregistered,
          );
          if (existingClient) {
            clientMapping.set(existingClient.id, {
              ...client,
              orderIndex: index + 1,
            });
          }
        }
      });

      // 4. Atualizar clientes existentes com novo orderIndex
      for (const [existingId, clientData] of clientMapping) {
        const existingData = existingStatusMap.get(
          clientData.clientId
            ? clientData.clientId.toString()
            : `${clientData.customerNameUnregistered}-${clientData.customerStateUnregistered}-${clientData.customerCityUnregistered}`,
        );

        if (clientData.clientId) {
          // Cliente cadastrado
          await tx
            .update(visitRouteClients)
            .set({
              orderIndex: clientData.orderIndex,
              visitStatus:
                clientData.visitStatus ||
                existingData?.visitStatus ||
                'AGENDADO',
              currentVisitDescription:
                clientData.currentVisitDescription ||
                existingData?.currentVisitDescription ||
                null,
              lastVisitDescription:
                clientData.lastVisitDescription ||
                existingData?.lastVisitDescription ||
                null,
              lastVisitConfirmedAt:
                safeDateConversion(clientData.lastVisitConfirmedAt) ||
                safeDateConversion(existingData?.lastVisitConfirmedAt),
              updatedAt: new Date(),
            })
            .where(eq(visitRouteClients.id, existingId));
        } else if (clientData.customerNameUnregistered) {
          // Cliente não cadastrado
          await tx
            .update(visitRouteClients)
            .set({
              orderIndex: clientData.orderIndex,
              visitStatus:
                clientData.visitStatus ||
                existingData?.visitStatus ||
                'AGENDADO',
              currentVisitDescription:
                clientData.currentVisitDescription ||
                existingData?.currentVisitDescription ||
                null,
              lastVisitDescription:
                clientData.lastVisitDescription ||
                existingData?.lastVisitDescription ||
                null,
              lastVisitConfirmedAt:
                safeDateConversion(clientData.lastVisitConfirmedAt) ||
                safeDateConversion(existingData?.lastVisitConfirmedAt),
              updatedAt: new Date(),
            })
            .where(eq(visitRouteClients.id, existingId));
        }
      }

      // 5. Remover clientes que não estão mais na lista
      const clientIdsToKeep = Array.from(clientMapping.keys());
      if (clientIdsToKeep.length > 0) {
        await tx
          .delete(visitRouteClients)
          .where(
            and(
              eq(visitRouteClients.visitRouteId, parseInt(routeId)),
              not(inArray(visitRouteClients.id, clientIdsToKeep)),
            ),
          );
      } else {
        // Se não há clientes para manter, remover todos
        await tx
          .delete(visitRouteClients)
          .where(eq(visitRouteClients.visitRouteId, parseInt(routeId)));
      }

      // 6. Inserir clientes novos que ainda não existiam na rota
      for (let index = 0; index < clients.length; index++) {
        const client: any = clients[index];

        // Verifica se já existe mapeamento (cliente existente). Se sim, pula.
        let exists = false;
        if (client.clientId) {
          exists = existingClients.some(
            (ec) => ec.clientId === parseInt(client.clientId),
          );
        } else if (client.customerNameUnregistered) {
          exists = existingClients.some(
            (ec) =>
              ec.customerNameUnregistered === client.customerNameUnregistered &&
              ec.customerStateUnregistered ===
                client.customerStateUnregistered &&
              ec.customerCityUnregistered === client.customerCityUnregistered,
          );
        }

        if (!exists) {
          const baseValues: any = {
            visitRouteId: parseInt(routeId),
            orderIndex: index + 1,
            visitStatus: client.visitStatus || 'AGENDADO',
            currentVisitDescription: client.currentVisitDescription || null,
            lastVisitDescription: client.lastVisitDescription || null,
            lastVisitConfirmedAt:
              client.visitStatus === 'CONCLUIDO'
                ? safeDateConversion(client.lastVisitConfirmedAt) || new Date()
                : null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          if (client.clientId) {
            // Inserir cliente cadastrado
            await tx.insert(visitRouteClients).values({
              ...baseValues,
              clientId: parseInt(client.clientId),
              customerNameUnregistered: null,
              customerStateUnregistered: null,
              customerCityUnregistered: null,
            });
          } else if (client.customerNameUnregistered) {
            // Inserir cliente não cadastrado
            await tx.insert(visitRouteClients).values({
              ...baseValues,
              clientId: null,
              customerNameUnregistered: client.customerNameUnregistered,
              customerStateUnregistered: client.customerStateUnregistered,
              customerCityUnregistered: client.customerCityUnregistered,
            });
          }
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
