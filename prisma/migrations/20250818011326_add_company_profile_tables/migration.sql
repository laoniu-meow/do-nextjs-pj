/*
  Warnings:

  - You are about to drop the column `companyName` on the `company_profile_staging` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `company_profile_staging` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `company_profile_staging` table. All the data in the column will be lost.
  - Added the required column `name` to the `company_profile_staging` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."company_profile_staging_createdAt_idx";

-- DropIndex
DROP INDEX "public"."company_profile_staging_isActive_idx";

-- DropIndex
DROP INDEX "public"."company_profile_staging_type_idx";

-- DropIndex
DROP INDEX "public"."company_profile_staging_updatedAt_idx";

-- AlterTable
ALTER TABLE "public"."company_profile_staging" DROP COLUMN "companyName",
DROP COLUMN "isActive",
DROP COLUMN "type",
ADD COLUMN     "isMainCompany" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "companyRegNumber" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "postalCode" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "contact" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."company_profile_production" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyRegNumber" TEXT,
    "email" TEXT,
    "address" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "contact" TEXT,
    "logo" TEXT,
    "isMainCompany" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_profile_production_pkey" PRIMARY KEY ("id")
);
