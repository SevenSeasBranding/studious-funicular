import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const estimates = await prisma.estimate.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(estimates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch estimates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const estimate = await prisma.estimate.create({
      data: {
        customerName: body.customerName,
        agentName: body.agentName,
        address: body.address,
        projectDescription: body.projectDescription,
        products: body.products,
        discounts: body.discounts,
        installationCost: body.installationCost,
        smallOrderShipping: body.smallOrderShipping,
        subtotalProducts: body.subtotalProducts,
        totalPrice: body.totalPrice,
        taxExempt: body.taxExempt,
        taxRateLow: body.taxRateLow,
        taxRateHigh: body.taxRateHigh,
        taxSource: body.taxSource,
        zipCode: body.zipCode,
      },
    });
    return NextResponse.json(estimate);
  } catch (error) {
    console.error('Save estimate error:', error);
    return NextResponse.json({ error: 'Failed to save estimate' }, { status: 500 });
  }
}

