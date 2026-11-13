-- Apply once before deploying the coordinated frontend/worker release.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pendingGenerationId" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "completedGenerationId" TEXT;
