import { NextResponse, NextRequest } from 'next/server';
import { db, users, User } from '@/app/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs'; // Importando bcryptjs

// METODO PUT:
export async function PUT(request: NextRequest) {
  const userToUpdate: User = await request.json();

  try {
    console.log('Dados recebidos para atualização:', userToUpdate);

    // Verifica se o usuário existe
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userToUpdate.id))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Atualiza o usuário
    const updatedUser = await db
      .update(users)
      .set({
        name: userToUpdate.name, // Adicionando a atualização do campo name
      })
      .where(eq(users.id, userToUpdate.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name, // Incluindo name no retorno
        password: users.password,
        createdAt: users.createdAt,
      })
      .execute();

    console.log('Usuário atualizado:', updatedUser);

    return NextResponse.json({ users: updatedUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao atualizar o usuário:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error('Erro desconhecido ao atualizar o usuário');
    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 },
    );
  }
}
