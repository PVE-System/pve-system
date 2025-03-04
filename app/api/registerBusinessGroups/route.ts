import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/app/db';
import { businessGroups, NewBusinessGroup } from '@/app/db/schema';

export async function POST(request: NextRequest) {
  try {
    // Recebe os dados do novo grupo empresarial
    const newGroup: NewBusinessGroup = await request.json();

    // Insere no banco de dados
    const insertedGroup = await db
      .insert(businessGroups)
      .values({
        name: newGroup.name,
      })
      .returning({
        id: businessGroups.id,
        name: businessGroups.name,
        createdAt: businessGroups.createdAt,
      })
      .execute();

    return NextResponse.json({ businessGroup: insertedGroup }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 },
    );
  }
}
