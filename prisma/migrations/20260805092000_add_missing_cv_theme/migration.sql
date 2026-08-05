-- The original CV migration was already recorded in production before the
-- theme column was added to that migration file. Keep this repair additive
-- and idempotent so databases created from either version remain valid.
ALTER TABLE "cv" ADD COLUMN IF NOT EXISTS "theme" JSONB;
