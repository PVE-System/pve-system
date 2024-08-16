import { NextResponse, NextRequest } from 'next/server';
import { db, users, User, NewUser } from '@/app/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs'; // Importando bcryptjs

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
        name: newUser.name,
        createdAt: new Date(), // Adicionando a data de criação
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
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
