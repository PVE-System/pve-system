import { NextResponse, NextRequest } from 'next/server';
import { db, users } from '@/app/db';
import { eq } from 'drizzle-orm';

// Método GET
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: 'User ID is required and must be valid' },
      { status: 400 },
    );
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
