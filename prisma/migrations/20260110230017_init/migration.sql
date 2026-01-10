-- CreateTable
CREATE TABLE "Estimate" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "products" JSONB NOT NULL,
    "discounts" JSONB NOT NULL,
    "installationCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "smallOrderShipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subtotalProducts" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "taxExempt" BOOLEAN NOT NULL DEFAULT false,
    "taxRateLow" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxRateHigh" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxSource" TEXT,
    "zipCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Estimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isCurrency" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalEntry" (
    "id" SERIAL NOT NULL,
    "month" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "entryData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "companyName" TEXT NOT NULL DEFAULT 'Green Mainland Luxury Windows and Doors',
    "documentTitle" TEXT NOT NULL DEFAULT 'Cost Estimate',
    "disclaimerText" TEXT NOT NULL DEFAULT 'This estimate does not include installation and is not an official quote.',
    "roundingOption" TEXT NOT NULL DEFAULT 'none',
    "invertText" BOOLEAN NOT NULL DEFAULT false,
    "bgImageOpacity" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "enableConversion" BOOLEAN NOT NULL DEFAULT false,
    "conversionTargetUnit" TEXT NOT NULL DEFAULT 'mm',
    "smartLockBaseCost" DOUBLE PRECISION NOT NULL DEFAULT 1100,
    "retractableScreenBaseRate" DOUBLE PRECISION NOT NULL DEFAULT 12,
    "glassTextureAddonCost" DOUBLE PRECISION NOT NULL DEFAULT 150,

    CONSTRAINT "GlobalSetting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GoalEntry" ADD CONSTRAINT "GoalEntry_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
