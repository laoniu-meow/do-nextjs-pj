-- AlterTable
ALTER TABLE "public"."categories" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."promotion_staging" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."supplier_staging" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."category_staging" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_staging_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_staging_slug_key" ON "public"."category_staging"("slug");

-- CreateIndex
CREATE INDEX "category_staging_parentId_idx" ON "public"."category_staging"("parentId");

-- CreateIndex
CREATE INDEX "category_staging_isActive_idx" ON "public"."category_staging"("isActive");
