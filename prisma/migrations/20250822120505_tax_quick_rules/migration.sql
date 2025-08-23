-- CreateEnum
CREATE TYPE "public"."PageTemplateType" AS ENUM ('HERO', 'INFOGRAPH', 'CARD_INFO');

-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."BackorderPolicy" AS ENUM ('NONE', 'ALLOW', 'PREORDER');

-- CreateEnum
CREATE TYPE "public"."PromotionType" AS ENUM ('PERCENT', 'FIXED', 'FREE_SHIPPING');

-- CreateEnum
CREATE TYPE "public"."PromotionScope" AS ENUM ('PRODUCT', 'CATEGORY', 'CART_MIN_SUBTOTAL');

-- CreateEnum
CREATE TYPE "public"."TaxPriceMode" AS ENUM ('INCLUSIVE', 'EXCLUSIVE');

-- CreateEnum
CREATE TYPE "public"."TaxRoundingStrategy" AS ENUM ('LINE', 'TOTAL');

-- CreateEnum
CREATE TYPE "public"."VariantKind" AS ENUM ('SIMPLE', 'BUNDLE');

-- CreateTable
CREATE TABLE "public"."hero_sections_staging" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "templateType" "public"."PageTemplateType" NOT NULL,
    "templateData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_sections_staging_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hero_sections_production" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "templateType" "public"."PageTemplateType" NOT NULL,
    "templateData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_sections_production_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "brandId" TEXT,
    "defaultVariantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "attributes" JSONB NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "compareAtPrice" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "kind" "public"."VariantKind" NOT NULL DEFAULT 'SIMPLE',
    "taxClassId" TEXT,
    "priceMode" "public"."TaxPriceMode" NOT NULL DEFAULT 'EXCLUSIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_bundle_components" (
    "bundleVariantId" TEXT NOT NULL,
    "componentVariantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_bundle_components_pkey" PRIMARY KEY ("bundleVariantId","componentVariantId")
);

-- CreateTable
CREATE TABLE "public"."inventory_items" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "stockOnHand" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 0,
    "backorderPolicy" "public"."BackorderPolicy" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."variant_suppliers" (
    "variantId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "supplierSku" TEXT,
    "costPrice" DECIMAL(10,2) NOT NULL,
    "leadTimeDays" INTEGER,
    "moq" INTEGER,
    "reorderPoint" INTEGER,
    "reorderQuantity" INTEGER,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variant_suppliers_pkey" PRIMARY KEY ("variantId","supplierId")
);

-- CreateTable
CREATE TABLE "public"."product_categories" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateTable
CREATE TABLE "public"."promotions" (
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

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."promotion_conditions" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "scope" "public"."PromotionScope" NOT NULL,
    "productIds" TEXT[],
    "categoryIds" TEXT[],
    "minSubtotal" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."promotion_usage" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "userId" TEXT,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotion_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tax_classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tax_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "classId" TEXT NOT NULL,
    "percentage" DECIMAL(5,4) NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isCompound" BOOLEAN NOT NULL DEFAULT false,
    "isInclusive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tax_settings" (
    "id" TEXT NOT NULL,
    "priceIncludesTax" BOOLEAN NOT NULL DEFAULT false,
    "roundingStrategy" "public"."TaxRoundingStrategy" NOT NULL DEFAULT 'LINE',
    "defaultPriceMode" "public"."TaxPriceMode" NOT NULL DEFAULT 'EXCLUSIVE',
    "defaultTaxClassId" TEXT,
    "shippingTaxClassId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tax_quick_rules_staging" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "ratePercent" DECIMAL(5,2) NOT NULL,
    "isInclusive" BOOLEAN NOT NULL DEFAULT false,
    "isGST" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_quick_rules_staging_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tax_quick_rules_production" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "ratePercent" DECIMAL(5,2) NOT NULL,
    "isInclusive" BOOLEAN NOT NULL DEFAULT false,
    "isGST" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_quick_rules_production_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hero_sections_staging_order_key" ON "public"."hero_sections_staging"("order");

-- CreateIndex
CREATE UNIQUE INDEX "hero_sections_production_order_key" ON "public"."hero_sections_production"("order");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "public"."brands"("slug");

-- CreateIndex
CREATE INDEX "brands_name_idx" ON "public"."brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_code_key" ON "public"."suppliers"("code");

-- CreateIndex
CREATE INDEX "suppliers_name_idx" ON "public"."suppliers"("name");

-- CreateIndex
CREATE INDEX "suppliers_isActive_idx" ON "public"."suppliers"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "public"."categories"("parentId");

-- CreateIndex
CREATE INDEX "categories_isActive_idx" ON "public"."categories"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "public"."products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_defaultVariantId_key" ON "public"."products"("defaultVariantId");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "public"."products"("status");

-- CreateIndex
CREATE INDEX "products_createdAt_idx" ON "public"."products"("createdAt");

-- CreateIndex
CREATE INDEX "products_title_idx" ON "public"."products"("title");

-- CreateIndex
CREATE INDEX "product_images_productId_sortOrder_idx" ON "public"."product_images"("productId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "public"."product_variants"("sku");

-- CreateIndex
CREATE INDEX "product_variants_productId_idx" ON "public"."product_variants"("productId");

-- CreateIndex
CREATE INDEX "product_variants_isActive_idx" ON "public"."product_variants"("isActive");

-- CreateIndex
CREATE INDEX "product_variants_taxClassId_idx" ON "public"."product_variants"("taxClassId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_variantId_key" ON "public"."inventory_items"("variantId");

-- CreateIndex
CREATE INDEX "variant_suppliers_supplierId_idx" ON "public"."variant_suppliers"("supplierId");

-- CreateIndex
CREATE INDEX "variant_suppliers_isPrimary_idx" ON "public"."variant_suppliers"("isPrimary");

-- CreateIndex
CREATE INDEX "product_categories_categoryId_idx" ON "public"."product_categories"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_code_key" ON "public"."promotions"("code");

-- CreateIndex
CREATE INDEX "promotions_isActive_idx" ON "public"."promotions"("isActive");

-- CreateIndex
CREATE INDEX "promotions_startsAt_idx" ON "public"."promotions"("startsAt");

-- CreateIndex
CREATE INDEX "promotions_endsAt_idx" ON "public"."promotions"("endsAt");

-- CreateIndex
CREATE INDEX "promotion_conditions_promotionId_idx" ON "public"."promotion_conditions"("promotionId");

-- CreateIndex
CREATE INDEX "promotion_usage_promotionId_idx" ON "public"."promotion_usage"("promotionId");

-- CreateIndex
CREATE INDEX "promotion_usage_promotionId_userId_idx" ON "public"."promotion_usage"("promotionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "tax_classes_code_key" ON "public"."tax_classes"("code");

-- CreateIndex
CREATE INDEX "tax_classes_name_idx" ON "public"."tax_classes"("name");

-- CreateIndex
CREATE INDEX "tax_rules_classId_idx" ON "public"."tax_rules"("classId");

-- CreateIndex
CREATE INDEX "tax_rules_priority_idx" ON "public"."tax_rules"("priority");

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_defaultVariantId_fkey" FOREIGN KEY ("defaultVariantId") REFERENCES "public"."product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_variants" ADD CONSTRAINT "product_variants_taxClassId_fkey" FOREIGN KEY ("taxClassId") REFERENCES "public"."tax_classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_bundle_components" ADD CONSTRAINT "product_bundle_components_bundleVariantId_fkey" FOREIGN KEY ("bundleVariantId") REFERENCES "public"."product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_bundle_components" ADD CONSTRAINT "product_bundle_components_componentVariantId_fkey" FOREIGN KEY ("componentVariantId") REFERENCES "public"."product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_items" ADD CONSTRAINT "inventory_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."variant_suppliers" ADD CONSTRAINT "variant_suppliers_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."variant_suppliers" ADD CONSTRAINT "variant_suppliers_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_categories" ADD CONSTRAINT "product_categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_categories" ADD CONSTRAINT "product_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."promotion_conditions" ADD CONSTRAINT "promotion_conditions_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "public"."promotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."promotion_usage" ADD CONSTRAINT "promotion_usage_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "public"."promotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tax_rules" ADD CONSTRAINT "tax_rules_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."tax_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tax_settings" ADD CONSTRAINT "tax_settings_defaultTaxClassId_fkey" FOREIGN KEY ("defaultTaxClassId") REFERENCES "public"."tax_classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tax_settings" ADD CONSTRAINT "tax_settings_shippingTaxClassId_fkey" FOREIGN KEY ("shippingTaxClassId") REFERENCES "public"."tax_classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
