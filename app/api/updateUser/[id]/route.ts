import { NextResponse, NextRequest } from 'next/server';
import { db, users, User, NewUser } from '@/app/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs'; // Importando bcryptjs

// METODO GET:

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id))) // Use eq para comparar o ID
      .execute();

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 },
    );
  }
}

// METODO POST:

export async function POST(request: NextRequest) {
  const newUser: NewUser = await request.json();

  try {
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const createdUser = await db
      .insert(users)
      .values({
        email: newUser.email,
        password: hashedPassword,
        name: newUser.name,
        operatorNumber: newUser.operatorNumber,
        createdAt: new Date(),
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        operatorNumber: users.operatorNumber,
        createdAt: users.createdAt,
      })
      .execute();

    return NextResponse.json({ users: createdUser });
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

// METODO PUT:

export async function PUT(request: NextRequest) {
  const userToUpdate: User = await request.json();

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userToUpdate.id))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await db
      .update(users)
      .set({
        email: userToUpdate.email,
        password: userToUpdate.password,
        name: userToUpdate.name,
        operatorNumber: userToUpdate.operatorNumber,
        createdAt: userToUpdate.createdAt,
        imageUrl: userToUpdate.imageUrl, // Adicionando a URL da imagem ao update
      })
      .where(eq(users.id, userToUpdate.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        password: users.password,
        operatorNumber: users.operatorNumber,
        createdAt: users.createdAt,
        imageUrl: users.imageUrl, // Incluindo a URL da imagem no retorno
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

// METODO DELETE:

export async function DELETE(request: NextRequest) {
  const userToDelete = await request.json();
  const deleteUser = await db
    .delete(users)
    .where(eq(users.id, userToDelete.id))
    .returning({
      id: users.id,
      email: users.email,
      password: users.password,
      operatorNumber: users.operatorNumber,
      createdAt: users.createdAt,
    });
  return NextResponse.json({ users: deleteUser });
}
