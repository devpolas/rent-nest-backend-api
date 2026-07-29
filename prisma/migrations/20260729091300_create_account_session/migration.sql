-- CreateTable
CREATE TABLE "account_session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "browser" TEXT,
    "operatingSystem" TEXT,
    "deviceType" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_session_refreshTokenHash_key" ON "account_session"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "account_session_userId_idx" ON "account_session"("userId");

-- CreateIndex
CREATE INDEX "account_session_expiresAt_idx" ON "account_session"("expiresAt");

-- AddForeignKey
ALTER TABLE "account_session" ADD CONSTRAINT "account_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
