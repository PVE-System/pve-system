import { NextResponse, NextRequest } from 'next/server';
import { db, users } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json(); // Pega o id do corpo da requisição

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    const deleteUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      });

    if (deleteUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ users: deleteUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 },
    );
  }
}
