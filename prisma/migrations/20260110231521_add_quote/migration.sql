-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "quoteNumber" TEXT NOT NULL,
    "logo" TEXT,
    "clientName" TEXT NOT NULL,
    "clientNumber" TEXT,
    "clientEmail" TEXT,
    "clientAddress" TEXT,
    "clientSignatureName" TEXT,
    "clientSignatureTitle" TEXT,
    "gmName" TEXT NOT NULL DEFAULT 'James Rivers',
    "gmTitle" TEXT NOT NULL DEFAULT 'Sales Representative',
    "products" JSONB NOT NULL,
    "pricing" JSONB NOT NULL,
    "discounts" JSONB NOT NULL,
    "automatedDiscounts" JSONB NOT NULL,
    "additionalTerms" JSONB NOT NULL,
    "totals" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);
