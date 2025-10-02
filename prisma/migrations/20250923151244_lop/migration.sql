-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "testProject" BOOLEAN NOT NULL DEFAULT false;
