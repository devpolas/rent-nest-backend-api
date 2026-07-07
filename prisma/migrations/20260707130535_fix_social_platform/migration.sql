/*
  Warnings:

  - Changed the type of `platform` on the `social_profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('GITHUB', 'LINKEDIN', 'FACEBOOK', 'TWITTER', 'INSTAGRAM', 'YOUTUBE', 'DISCORD', 'TELEGRAM', 'WHATSAPP', 'WEBSITE');

-- AlterTable
ALTER TABLE "social_profile" DROP COLUMN "platform",
ADD COLUMN     "platform" "SocialPlatform" NOT NULL;
