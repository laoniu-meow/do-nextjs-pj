/*
  Warnings:

  - The values [BRANCH] on the enum `CompanyProfileType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."DropShadow" AS ENUM ('NONE', 'LIGHT', 'MEDIUM', 'STRONG');

-- CreateEnum
CREATE TYPE "public"."ButtonShape" AS ENUM ('ROUNDED', 'CIRCLE', 'SQUARE');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."CompanyProfileType_new" AS ENUM ('MAIN', 'REMOTE');
ALTER TABLE "public"."company_profiles" ALTER COLUMN "type" TYPE "public"."CompanyProfileType_new" USING ("type"::text::"public"."CompanyProfileType_new");
ALTER TYPE "public"."CompanyProfileType" RENAME TO "CompanyProfileType_old";
ALTER TYPE "public"."CompanyProfileType_new" RENAME TO "CompanyProfileType";
DROP TYPE "public"."CompanyProfileType_old";
COMMIT;

-- CreateTable
CREATE TABLE "public"."header_settings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Default Header Settings',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "desktopHeight" INTEGER NOT NULL DEFAULT 64,
    "desktopPaddingHorizontal" INTEGER NOT NULL DEFAULT 16,
    "desktopLogoWidth" INTEGER NOT NULL DEFAULT 40,
    "desktopLogoHeight" INTEGER NOT NULL DEFAULT 40,
    "desktopQuickButtonSize" INTEGER NOT NULL DEFAULT 40,
    "desktopMenuButtonSize" INTEGER NOT NULL DEFAULT 40,
    "tabletHeight" INTEGER NOT NULL DEFAULT 64,
    "tabletPaddingHorizontal" INTEGER NOT NULL DEFAULT 16,
    "tabletLogoWidth" INTEGER NOT NULL DEFAULT 40,
    "tabletLogoHeight" INTEGER NOT NULL DEFAULT 40,
    "tabletQuickButtonSize" INTEGER NOT NULL DEFAULT 40,
    "tabletMenuButtonSize" INTEGER NOT NULL DEFAULT 40,
    "mobileHeight" INTEGER NOT NULL DEFAULT 64,
    "mobilePaddingHorizontal" INTEGER NOT NULL DEFAULT 16,
    "mobileLogoWidth" INTEGER NOT NULL DEFAULT 40,
    "mobileLogoHeight" INTEGER NOT NULL DEFAULT 40,
    "mobileQuickButtonSize" INTEGER NOT NULL DEFAULT 40,
    "mobileMenuButtonSize" INTEGER NOT NULL DEFAULT 40,
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "pageBackgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "dropShadow" "public"."DropShadow" NOT NULL DEFAULT 'MEDIUM',
    "quickButtonBgColor" TEXT NOT NULL DEFAULT '#f3f4f6',
    "quickButtonIconColor" TEXT NOT NULL DEFAULT '#6b7280',
    "quickButtonHoverBgColor" TEXT NOT NULL DEFAULT '#e5e7eb',
    "quickButtonHoverIconColor" TEXT NOT NULL DEFAULT '#374151',
    "quickButtonShape" "public"."ButtonShape" NOT NULL DEFAULT 'ROUNDED',
    "quickButtonShadow" "public"."DropShadow" NOT NULL DEFAULT 'LIGHT',
    "quickButtonGap" TEXT NOT NULL DEFAULT '8px',
    "menuButtonBgColor" TEXT NOT NULL DEFAULT 'var(--color-neutral-200)',
    "menuButtonIconColor" TEXT NOT NULL DEFAULT 'var(--color-neutral-700)',
    "menuButtonHoverBgColor" TEXT NOT NULL DEFAULT 'var(--color-neutral-300)',
    "menuButtonHoverIconColor" TEXT NOT NULL DEFAULT 'var(--color-neutral-800)',
    "menuButtonIconId" TEXT NOT NULL DEFAULT 'menu',
    "menuButtonShape" "public"."ButtonShape" NOT NULL DEFAULT 'ROUNDED',
    "menuButtonShadow" "public"."DropShadow" NOT NULL DEFAULT 'LIGHT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "header_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."header_settings_staging" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Staging Header Settings',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "desktopHeight" INTEGER NOT NULL DEFAULT 64,
    "desktopPaddingHorizontal" INTEGER NOT NULL DEFAULT 16,
    "desktopLogoWidth" INTEGER NOT NULL DEFAULT 40,
    "desktopLogoHeight" INTEGER NOT NULL DEFAULT 40,
    "desktopQuickButtonSize" INTEGER NOT NULL DEFAULT 40,
    "desktopMenuButtonSize" INTEGER NOT NULL DEFAULT 40,
    "tabletHeight" INTEGER NOT NULL DEFAULT 64,
    "tabletPaddingHorizontal" INTEGER NOT NULL DEFAULT 16,
    "tabletLogoWidth" INTEGER NOT NULL DEFAULT 40,
    "tabletLogoHeight" INTEGER NOT NULL DEFAULT 40,
    "tabletQuickButtonSize" INTEGER NOT NULL DEFAULT 40,
    "tabletMenuButtonSize" INTEGER NOT NULL DEFAULT 40,
    "mobileHeight" INTEGER NOT NULL DEFAULT 64,
    "mobilePaddingHorizontal" INTEGER NOT NULL DEFAULT 16,
    "mobileLogoWidth" INTEGER NOT NULL DEFAULT 40,
    "mobileLogoHeight" INTEGER NOT NULL DEFAULT 40,
    "mobileQuickButtonSize" INTEGER NOT NULL DEFAULT 40,
    "mobileMenuButtonSize" INTEGER NOT NULL DEFAULT 40,
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "pageBackgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "dropShadow" "public"."DropShadow" NOT NULL DEFAULT 'MEDIUM',
    "quickButtonBgColor" TEXT NOT NULL DEFAULT '#f3f4f6',
    "quickButtonIconColor" TEXT NOT NULL DEFAULT '#6b7280',
    "quickButtonHoverBgColor" TEXT NOT NULL DEFAULT '#e5e7eb',
    "quickButtonHoverIconColor" TEXT NOT NULL DEFAULT '#374151',
    "quickButtonShape" "public"."ButtonShape" NOT NULL DEFAULT 'ROUNDED',
    "quickButtonShadow" "public"."DropShadow" NOT NULL DEFAULT 'LIGHT',
    "quickButtonGap" TEXT NOT NULL DEFAULT '8px',
    "menuButtonBgColor" TEXT NOT NULL DEFAULT 'var(--color-neutral-200)',
    "menuButtonIconColor" TEXT NOT NULL DEFAULT 'var(--color-neutral-700)',
    "menuButtonHoverBgColor" TEXT NOT NULL DEFAULT 'var(--color-neutral-300)',
    "menuButtonHoverIconColor" TEXT NOT NULL DEFAULT 'var(--color-neutral-800)',
    "menuButtonIconId" TEXT NOT NULL DEFAULT 'menu',
    "menuButtonShape" "public"."ButtonShape" NOT NULL DEFAULT 'ROUNDED',
    "menuButtonShadow" "public"."DropShadow" NOT NULL DEFAULT 'LIGHT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "header_settings_staging_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."header_settings_production" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Production Header Settings',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "desktopHeight" INTEGER NOT NULL DEFAULT 64,
    "desktopPaddingHorizontal" INTEGER NOT NULL DEFAULT 16,
    "desktopLogoWidth" INTEGER NOT NULL DEFAULT 40,
    "desktopLogoHeight" INTEGER NOT NULL DEFAULT 40,
    "desktopQuickButtonSize" INTEGER NOT NULL DEFAULT 40,
    "desktopMenuButtonSize" INTEGER NOT NULL DEFAULT 40,
    "tabletHeight" INTEGER NOT NULL DEFAULT 64,
    "tabletPaddingHorizontal" INTEGER NOT NULL DEFAULT 16,
    "tabletLogoWidth" INTEGER NOT NULL DEFAULT 40,
    "tabletLogoHeight" INTEGER NOT NULL DEFAULT 40,
    "tabletQuickButtonSize" INTEGER NOT NULL DEFAULT 40,
    "tabletMenuButtonSize" INTEGER NOT NULL DEFAULT 40,
    "mobileHeight" INTEGER NOT NULL DEFAULT 64,
    "mobilePaddingHorizontal" INTEGER NOT NULL DEFAULT 16,
    "mobileLogoWidth" INTEGER NOT NULL DEFAULT 40,
    "mobileLogoHeight" INTEGER NOT NULL DEFAULT 40,
    "mobileQuickButtonSize" INTEGER NOT NULL DEFAULT 40,
    "mobileMenuButtonSize" INTEGER NOT NULL DEFAULT 40,
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "pageBackgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "dropShadow" "public"."DropShadow" NOT NULL DEFAULT 'MEDIUM',
    "quickButtonBgColor" TEXT NOT NULL DEFAULT '#f3f4f6',
    "quickButtonIconColor" TEXT NOT NULL DEFAULT '#6b7280',
    "quickButtonHoverBgColor" TEXT NOT NULL DEFAULT '#e5e7eb',
    "quickButtonHoverIconColor" TEXT NOT NULL DEFAULT '#374151',
    "quickButtonShape" "public"."ButtonShape" NOT NULL DEFAULT 'ROUNDED',
    "quickButtonShadow" "public"."DropShadow" NOT NULL DEFAULT 'LIGHT',
    "quickButtonGap" TEXT NOT NULL DEFAULT '8px',
    "menuButtonBgColor" TEXT NOT NULL DEFAULT 'var(--color-neutral-200)',
    "menuButtonIconColor" TEXT NOT NULL DEFAULT 'var(--color-neutral-700)',
    "menuButtonHoverBgColor" TEXT NOT NULL DEFAULT 'var(--color-neutral-300)',
    "menuButtonHoverIconColor" TEXT NOT NULL DEFAULT 'var(--color-neutral-800)',
    "menuButtonIconId" TEXT NOT NULL DEFAULT 'menu',
    "menuButtonShape" "public"."ButtonShape" NOT NULL DEFAULT 'ROUNDED',
    "menuButtonShadow" "public"."DropShadow" NOT NULL DEFAULT 'LIGHT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "header_settings_production_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "header_settings_name_idx" ON "public"."header_settings"("name");

-- CreateIndex
CREATE INDEX "header_settings_isActive_idx" ON "public"."header_settings"("isActive");

-- CreateIndex
CREATE INDEX "header_settings_createdAt_idx" ON "public"."header_settings"("createdAt");

-- CreateIndex
CREATE INDEX "header_settings_updatedAt_idx" ON "public"."header_settings"("updatedAt");

-- CreateIndex
CREATE INDEX "header_settings_staging_name_idx" ON "public"."header_settings_staging"("name");

-- CreateIndex
CREATE INDEX "header_settings_staging_isActive_idx" ON "public"."header_settings_staging"("isActive");

-- CreateIndex
CREATE INDEX "header_settings_staging_createdAt_idx" ON "public"."header_settings_staging"("createdAt");

-- CreateIndex
CREATE INDEX "header_settings_staging_updatedAt_idx" ON "public"."header_settings_staging"("updatedAt");

-- CreateIndex
CREATE INDEX "header_settings_production_name_idx" ON "public"."header_settings_production"("name");

-- CreateIndex
CREATE INDEX "header_settings_production_isActive_idx" ON "public"."header_settings_production"("isActive");

-- CreateIndex
CREATE INDEX "header_settings_production_createdAt_idx" ON "public"."header_settings_production"("createdAt");

-- CreateIndex
CREATE INDEX "header_settings_production_updatedAt_idx" ON "public"."header_settings_production"("updatedAt");
