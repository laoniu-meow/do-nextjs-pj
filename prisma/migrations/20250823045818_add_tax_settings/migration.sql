-- CreateTable
CREATE TABLE "public"."supplier_staging" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_staging_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tax_settings" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ratePercent" TEXT NOT NULL,
    "isInclusive" BOOLEAN NOT NULL DEFAULT false,
    "isGST" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "supplier_staging_code_key" ON "public"."supplier_staging"("code");

-- CreateIndex
CREATE INDEX "supplier_staging_name_idx" ON "public"."supplier_staging"("name");

-- CreateIndex
CREATE INDEX "supplier_staging_isActive_idx" ON "public"."supplier_staging"("isActive");

-- CreateIndex
CREATE INDEX "tax_settings_description_idx" ON "public"."tax_settings"("description");
