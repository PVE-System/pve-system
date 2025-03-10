import { db } from '@/app/db';
import { businessGroups, BusinessGroup } from '@/app/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const allBusinessGroups: BusinessGroup[] = await db
      .select()
      .from(businessGroups);

    return NextResponse.json(
      { businessGroups: allBusinessGroups },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }, // Evita cache
    );
  } catch (error) {
    console.error('Erro ao buscar grupos empresariais:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar grupos empresariais' },
      { status: 500 },
    );
  }
}
