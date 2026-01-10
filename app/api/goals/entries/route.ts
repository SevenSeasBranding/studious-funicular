import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { goalId, month, entryData } = body;
    
    const entry = await prisma.goalEntry.create({
      data: {
        goalId,
        month,
        date: new Date().toLocaleString(),
        entryData,
      },
    });
    
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Save goal entry error:', error);
    return NextResponse.json({ error: 'Failed to save goal entry' }, { status: 500 });
  }
}

