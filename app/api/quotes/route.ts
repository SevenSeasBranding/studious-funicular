import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const quote = await prisma.quote.create({
      data: {
        quoteNumber: body.quoteNumber,
        logo: body.logo,
        clientName: body.client.name,
        clientNumber: body.client.number,
        clientEmail: body.client.email,
        clientAddress: body.client.address,
        clientSignatureName: body.client.signatureName,
        clientSignatureTitle: body.client.signatureTitle,
        gmName: body.greenMainland.name,
        gmTitle: body.greenMainland.title,
        products: body.products,
        pricing: body.pricing,
        discounts: body.discounts,
        automatedDiscounts: body.automatedDiscounts,
        additionalTerms: body.additionalTerms,
        totals: body.totals,
      },
    });
    return NextResponse.json(quote);
  } catch (error) {
    console.error('Save quote error:', error);
    return NextResponse.json({ error: 'Failed to save quote' }, { status: 500 });
  }
}

