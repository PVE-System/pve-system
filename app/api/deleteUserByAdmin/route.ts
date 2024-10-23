import { NextResponse, NextRequest } from 'next/server';
import { db, users } from '@/app/db'; // Supondo que tabs_viewed também está no seu esquema de DB
import { eq } from 'drizzle-orm';
import { tabsViewed } from '@/app/db/schema';

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    console.log('Attempting to delete user with ID:', id);

    // 1. Deletar todos os registros de tabs_viewed vinculados a esse usuário
    await db
      .delete(tabsViewed)
      .where(eq(tabsViewed.userId, id)) // Assumindo que user_id é o campo que referencia o usuário
      .execute();
    console.log('Deleted associated tabs_viewed records');

    // 2. Agora deletar o usuário após deletar os registros em tabs_viewed
    const deleteUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    if (deleteUser.length === 0) {
      console.log('User not found with ID:', id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User deleted successfully:', deleteUser);

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 },
    );
  }
}
