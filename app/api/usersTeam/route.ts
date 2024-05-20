import { NextResponse, NextRequest } from 'next/server';
import { db, usersTeam, User, NewUser } from '@/app/db';
import { eq } from 'drizzle-orm';
/* import { usersTeam, User, NewUser } from '@/app/db/schema/usersTeam'; */

export async function GET(request: NextRequest) {
  return NextResponse.json({ usersTeam: await db.select().from(usersTeam) });
  /*   const allUsers: User[] = await db.select().from(usersTeam);
  return NextResponse.json({ users: allUsers }); */
}

export async function POST(request: NextRequest) {
  const newUser: NewUser = await request.json();

  try {
    const createdUser = await db
      .insert(usersTeam)
      .values(newUser)
      .returning({
        id: usersTeam.id,
        email: usersTeam.email,
        password: usersTeam.password,
        createdAt: usersTeam.createdAt,
      })
      .execute();

    return NextResponse.json({ usersTeam: createdUser });
  } catch (error: unknown) {
    // Tipagem explícita do erro como um objeto com uma propriedade 'message'
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

export async function PUT(request: NextRequest) {
  const userToUpdate: User = await request.json();

  try {
    // Verifica se o usuário existe
    const existingUser = await db
      .select()
      .from(usersTeam)
      .where(eq(usersTeam.id, userToUpdate.id))
      .limit(1);
    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Atualiza o usuário
    const updatedUser = await db
      .update(usersTeam)
      .set({
        email: userToUpdate.email,
        password: userToUpdate.password,
        createdAt: userToUpdate.createdAt,
      })
      .where(eq(usersTeam.id, userToUpdate.id))
      .returning({
        id: usersTeam.id,
        email: usersTeam.email,
        password: usersTeam.password,
        createdAt: usersTeam.createdAt,
      })
      .execute();

    return NextResponse.json({ usersTeam: updatedUser });
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

export async function DELETE(request: NextRequest) {
  const userToDelete = await request.json();
  const deleteUser = await db
    .delete(usersTeam)
    .where(eq(usersTeam.id, userToDelete.id))
    .returning({
      id: usersTeam.id,
      email: usersTeam.email,
      password: usersTeam.password,
      createdAt: usersTeam.createdAt,
    });
  return NextResponse.json({ usersTeam: deleteUser });
}
