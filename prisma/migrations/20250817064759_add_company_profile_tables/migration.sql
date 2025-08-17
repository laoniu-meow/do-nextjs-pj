-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER', 'EDITOR');

-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('PAGE', 'BLOG', 'NEWS', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."CompanyProfileType" AS ENUM ('MAIN', 'BRANCH');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."ContentType" NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."company_profiles" (
    "id" TEXT NOT NULL,
    "type" "public"."CompanyProfileType" NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyRegNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."company_profile_staging" (
    "id" TEXT NOT NULL,
    "type" "public"."CompanyProfileType" NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyRegNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_profile_staging_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "public"."users"("createdAt");

-- CreateIndex
CREATE INDEX "companies_name_idx" ON "public"."companies"("name");

-- CreateIndex
CREATE INDEX "companies_email_idx" ON "public"."companies"("email");

-- CreateIndex
CREATE INDEX "companies_createdAt_idx" ON "public"."companies"("createdAt");

-- CreateIndex
CREATE INDEX "companies_updatedAt_idx" ON "public"."companies"("updatedAt");

-- CreateIndex
CREATE INDEX "contents_type_idx" ON "public"."contents"("type");

-- CreateIndex
CREATE INDEX "contents_status_idx" ON "public"."contents"("status");

-- CreateIndex
CREATE INDEX "contents_createdAt_idx" ON "public"."contents"("createdAt");

-- CreateIndex
CREATE INDEX "contents_updatedAt_idx" ON "public"."contents"("updatedAt");

-- CreateIndex
CREATE INDEX "contents_type_status_idx" ON "public"."contents"("type", "status");

-- CreateIndex
CREATE INDEX "contents_title_idx" ON "public"."contents"("title");

-- CreateIndex
CREATE INDEX "company_profiles_type_idx" ON "public"."company_profiles"("type");

-- CreateIndex
CREATE INDEX "company_profiles_isActive_idx" ON "public"."company_profiles"("isActive");

-- CreateIndex
CREATE INDEX "company_profiles_createdAt_idx" ON "public"."company_profiles"("createdAt");

-- CreateIndex
CREATE INDEX "company_profiles_updatedAt_idx" ON "public"."company_profiles"("updatedAt");

-- CreateIndex
CREATE INDEX "company_profile_staging_type_idx" ON "public"."company_profile_staging"("type");

-- CreateIndex
CREATE INDEX "company_profile_staging_isActive_idx" ON "public"."company_profile_staging"("isActive");

-- CreateIndex
CREATE INDEX "company_profile_staging_createdAt_idx" ON "public"."company_profile_staging"("createdAt");

-- CreateIndex
CREATE INDEX "company_profile_staging_updatedAt_idx" ON "public"."company_profile_staging"("updatedAt");
