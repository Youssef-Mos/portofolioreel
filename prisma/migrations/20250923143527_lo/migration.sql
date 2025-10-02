/*
  Warnings:

  - You are about to drop the column `company` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `current` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `technologies` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `githubUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `isTestable` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `liveUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `shortDesc` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `technologies` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ExperienceType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'APPRENTICESHIP', 'FREELANCE', 'VOLUNTEER', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EngagementType" AS ENUM ('ASSOCIATION', 'VOLUNTEER', 'LEADERSHIP', 'EVENT', 'COMMUNITY', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Experience" DROP COLUMN "company",
DROP COLUMN "current",
DROP COLUMN "location",
DROP COLUMN "order",
DROP COLUMN "technologies",
ADD COLUMN     "durationMonths" INTEGER,
ADD COLUMN     "keyAchievements" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "kind" "public"."ExperienceType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "place" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "startDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "featured",
DROP COLUMN "githubUrl",
DROP COLUMN "image",
DROP COLUMN "isTestable",
DROP COLUMN "liveUrl",
DROP COLUMN "order",
DROP COLUMN "shortDesc",
DROP COLUMN "technologies",
ADD COLUMN     "durationMonths" INTEGER,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "keyPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "teamSize" INTEGER,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "password",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordHash" TEXT;

-- DropTable
DROP TABLE "public"."Contact";

-- DropTable
DROP TABLE "public"."Skill";

-- CreateTable
CREATE TABLE "public"."Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    "iconUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Engagement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "place" TEXT,
    "kind" "public"."EngagementType" NOT NULL DEFAULT 'OTHER',
    "description" TEXT,
    "durationMonths" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "keyAchievements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_ProjectToTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToTechnology_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_ExperienceToTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExperienceToTechnology_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_EngagementToTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EngagementToTechnology_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Technology_slug_key" ON "public"."Technology"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "_ProjectToTechnology_B_index" ON "public"."_ProjectToTechnology"("B");

-- CreateIndex
CREATE INDEX "_ExperienceToTechnology_B_index" ON "public"."_ExperienceToTechnology"("B");

-- CreateIndex
CREATE INDEX "_EngagementToTechnology_B_index" ON "public"."_EngagementToTechnology"("B");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProjectToTechnology" ADD CONSTRAINT "_ProjectToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProjectToTechnology" ADD CONSTRAINT "_ProjectToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ExperienceToTechnology" ADD CONSTRAINT "_ExperienceToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ExperienceToTechnology" ADD CONSTRAINT "_ExperienceToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EngagementToTechnology" ADD CONSTRAINT "_EngagementToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Engagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EngagementToTechnology" ADD CONSTRAINT "_EngagementToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
