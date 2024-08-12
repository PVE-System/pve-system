/* import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/app/db'; // Ajuste o caminho conforme necessário
import { clients, NewClient } from '@/app/db/schema'; // Ajuste o caminho conforme necessário
import { NextRequest, NextResponse } from 'next/server';

// METODO GET:
export async function GET(request: NextRequest) {
  return NextResponse.json({ users: await db.select().from(clients) });
}

// METODO POST:
export async function POST(request: NextRequest) {
  const newClient: NewClient = await request.json();

  try {
    const createdClient = await db
      .insert(clients)
      .values({
        id: newClient.id,
        companyName: newClient.companyName,
        cnpj: newClient.cnpj,
        cpf: newClient.cpf,
        cep: newClient.cep,
        address: newClient.address,
        locationNumber: newClient.locationNumber,
        district: newClient.district,
        city: newClient.city,
        state: newClient.state,
        corfioCode: newClient.corfioCode,
        phone: newClient.phone,
        emailCommercial: newClient.emailCommercial,
        emailFinancial: newClient.emailFinancial,
        emailXml: newClient.emailXml,
        socialMedia: newClient.socialMedia,
        contactAtCompany: newClient.contactAtCompany,
        financialContact: newClient.financialContact,
        responsibleSeller: newClient.responsibleSeller,
        createdAt: newClient.createdAt,
        companySize: newClient.companySize,
        hasOwnStore: newClient.hasOwnStore,
        icmsContributor: newClient.icmsContributor,
        transportationType: newClient.transportationType,
        companyLocation: newClient.companyLocation,
        marketSegmentNature: newClient.marketSegmentNature,
        rating: newClient.rating,
        clientCondition: newClient.clientCondition,
      })
      .returning({
        id: clients.id,
      })
      .execute();

    return NextResponse.json({ clientId: createdClient[0].id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Tratamento de erro genérico se o erro não for uma instância de Error
    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 },
    );
  }
}
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/app/db'; // Ajuste o caminho conforme necessário
import { clients, NewClient } from '@/app/db/schema'; // Ajuste o caminho conforme necessário
import { NextRequest, NextResponse } from 'next/server';

// METODO GET:
export async function GET(request: NextRequest) {
  const users = await db.select().from(clients);
  const response = NextResponse.json({ users });
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}

// METODO POST:
export async function POST(request: NextRequest) {
  const newClient: NewClient = await request.json();

  try {
    const createdClient = await db
      .insert(clients)
      .values({
        companyName: newClient.companyName,
        cnpj: newClient.cnpj,
        cpf: newClient.cpf,
        cep: newClient.cep,
        address: newClient.address,
        locationNumber: newClient.locationNumber,
        district: newClient.district,
        city: newClient.city,
        state: newClient.state,
        corfioCode: newClient.corfioCode,
        phone: newClient.phone,
        emailCommercial: newClient.emailCommercial,
        emailFinancial: newClient.emailFinancial,
        emailXml: newClient.emailXml,
        socialMedia: newClient.socialMedia,
        contactAtCompany: newClient.contactAtCompany,
        financialContact: newClient.financialContact,
        responsibleSeller: newClient.responsibleSeller,
        createdAt: newClient.createdAt,
        companySize: newClient.companySize,
        hasOwnStore: newClient.hasOwnStore,
        icmsContributor: newClient.icmsContributor,
        transportationType: newClient.transportationType,
        companyLocation: newClient.companyLocation,
        marketSegmentNature: newClient.marketSegmentNature,
        rating: newClient.rating,
        clientCondition: newClient.clientCondition,
      })
      .returning({
        id: clients.id,
      })
      .execute();

    const response = NextResponse.json({ clientId: createdClient[0].id });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Tratamento de erro genérico se o erro não for uma instância de Error
    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 },
    );
  }
}
