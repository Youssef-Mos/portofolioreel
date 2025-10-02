/*
  Warnings:

  - You are about to drop the column `durationMonths` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `keyAchievements` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `kind` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `place` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `durationMonths` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `favorite` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `keyPoints` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `teamSize` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Engagement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Technology` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EngagementToTechnology` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExperienceToTechnology` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToTechnology` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `Experience` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `Experience` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_EngagementToTechnology" DROP CONSTRAINT "_EngagementToTechnology_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_EngagementToTechnology" DROP CONSTRAINT "_EngagementToTechnology_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ExperienceToTechnology" DROP CONSTRAINT "_ExperienceToTechnology_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ExperienceToTechnology" DROP CONSTRAINT "_ExperienceToTechnology_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProjectToTechnology" DROP CONSTRAINT "_ProjectToTechnology_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProjectToTechnology" DROP CONSTRAINT "_ProjectToTechnology_B_fkey";

-- AlterTable
ALTER TABLE "public"."Experience" DROP COLUMN "durationMonths",
DROP COLUMN "keyAchievements",
DROP COLUMN "kind",
DROP COLUMN "place",
ADD COLUMN     "company" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "current" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "technologies" TEXT[],
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "durationMonths",
DROP COLUMN "endDate",
DROP COLUMN "favorite",
DROP COLUMN "keyPoints",
DROP COLUMN "keywords",
DROP COLUMN "logoUrl",
DROP COLUMN "startDate",
DROP COLUMN "teamSize",
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "image" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isTestable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "liveUrl" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shortDesc" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "technologies" TEXT[],
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "emailVerified",
DROP COLUMN "isAdmin",
DROP COLUMN "passwordHash",
ADD COLUMN     "password" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "public"."Account";

-- DropTable
DROP TABLE "public"."Engagement";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."Technology";

-- DropTable
DROP TABLE "public"."VerificationToken";

-- DropTable
DROP TABLE "public"."_EngagementToTechnology";

-- DropTable
DROP TABLE "public"."_ExperienceToTechnology";

-- DropTable
DROP TABLE "public"."_ProjectToTechnology";

-- DropEnum
DROP TYPE "public"."EngagementType";

-- DropEnum
DROP TYPE "public"."ExperienceType";

-- CreateTable
CREATE TABLE "public"."Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
