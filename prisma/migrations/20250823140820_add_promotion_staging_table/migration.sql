-- CreateTable
CREATE TABLE "public"."promotion_staging" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "type" "public"."PromotionType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "allowStacking" BOOLEAN NOT NULL DEFAULT true,
    "stackingPriority" INTEGER NOT NULL DEFAULT 0,
    "maxUses" INTEGER,
    "maxUsesPerUser" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_staging_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tax_settings_staging" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ratePercent" TEXT NOT NULL,
    "isInclusive" BOOLEAN NOT NULL DEFAULT false,
    "isGST" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_settings_staging_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promotion_staging_code_key" ON "public"."promotion_staging"("code");

-- CreateIndex
CREATE INDEX "promotion_staging_isActive_idx" ON "public"."promotion_staging"("isActive");

-- CreateIndex
CREATE INDEX "promotion_staging_startsAt_idx" ON "public"."promotion_staging"("startsAt");

-- CreateIndex
CREATE INDEX "promotion_staging_endsAt_idx" ON "public"."promotion_staging"("endsAt");

-- CreateIndex
CREATE INDEX "tax_settings_staging_description_idx" ON "public"."tax_settings_staging"("description");
