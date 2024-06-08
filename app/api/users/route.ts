import { NextResponse, NextRequest } from 'next/server';
import { db, users, User, NewUser } from '@/app/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs'; // Importando bcryptjs

//METODO GET:

export async function GET(request: NextRequest) {
  return NextResponse.json({ users: await db.select().from(users) });
  /* const allUsers: User[] = await db.select().from(users);
  return NextResponse.json({ users: allUsers }); */
}

//METODO POST:

export async function POST(request: NextRequest) {
  const newUser: NewUser = await request.json();

  try {
    // Hash da senha do usuário
    const hashedPassword = await bcrypt.hash(newUser.password, 10); // Hash da senha com 10 rounds

    // Inserindo o usuário no banco de dados com a senha hasheada
    const createdUser = await db
      .insert(users)
      .values({
        email: newUser.email,
        password: hashedPassword, // Usando a senha hasheada
        createdAt: new Date(), // Adicionando a data de criação
      })
      .returning({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
      })
      .execute();

    return NextResponse.json({ users: createdUser });
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

//METODO PUT:

export async function PUT(request: NextRequest) {
  const userToUpdate: User = await request.json();

  try {
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
        email: userToUpdate.email,
        password: userToUpdate.password,
        createdAt: userToUpdate.createdAt,
      })
      .where(eq(users.id, userToUpdate.id))
      .returning({
        id: users.id,
        email: users.email,
        password: users.password,
        createdAt: users.createdAt,
      })
      .execute();

    return NextResponse.json({ users: updatedUser });
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

//METODO DELETE:

export async function DELETE(request: NextRequest) {
  const userToDelete = await request.json();
  const deleteUser = await db
    .delete(users)
    .where(eq(users.id, userToDelete.id))
    .returning({
      id: users.id,
      email: users.email,
      password: users.password,
      createdAt: users.createdAt,
    });
  return NextResponse.json({ users: deleteUser });
}
