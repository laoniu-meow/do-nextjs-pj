-- CreateTable
CREATE TABLE "public"."product_categories_hierarchy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_categories_hierarchy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_category_staging" (
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

    CONSTRAINT "product_category_staging_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_hierarchy_slug_key" ON "public"."product_categories_hierarchy"("slug");

-- CreateIndex
CREATE INDEX "product_categories_hierarchy_parentId_idx" ON "public"."product_categories_hierarchy"("parentId");

-- CreateIndex
CREATE INDEX "product_categories_hierarchy_isActive_idx" ON "public"."product_categories_hierarchy"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "product_category_staging_slug_key" ON "public"."product_category_staging"("slug");

-- CreateIndex
CREATE INDEX "product_category_staging_parentId_idx" ON "public"."product_category_staging"("parentId");

-- CreateIndex
CREATE INDEX "product_category_staging_isActive_idx" ON "public"."product_category_staging"("isActive");

-- AddForeignKey
ALTER TABLE "public"."product_categories_hierarchy" ADD CONSTRAINT "product_categories_hierarchy_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."product_categories_hierarchy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
