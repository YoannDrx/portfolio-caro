#!/usr/bin/env node
/**
 * Vercel Build Pipeline
 *
 * This script is automatically executed by Vercel during deployments.
 * It ensures that database migrations are applied before building the application.
 *
 * Pipeline:
 * 1. Apply Prisma migrations to production database (Neon main branch)
 * 2. Generate Prisma Client with updated schema
 * 3. Build Next.js application
 *
 * Environment variables required:
 * - DATABASE_URL: Pooled connection URL (for runtime)
 * - DIRECT_URL: Direct connection URL (for migrations)
 *
 * Usage: This script is automatically called by Vercel when "vercel-build" script exists
 */

const { spawnSync } = require('child_process')

/**
 * Execute a command with proper error handling and logging
 */
function run(command, args, description) {
  console.log(`\n📦 ${description}...`)
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: process.env,
  })

  if (result.status !== 0) {
    console.error(`❌ ${description} - Failed`)
    console.error(`   Exit code: ${String(result.status ?? 'unknown')}`)
    process.exit(1)
  }

  console.log(`✅ ${description} - Success`)
}

console.log('\n' + '━'.repeat(60))
console.log('🚀 VERCEL BUILD PIPELINE')
console.log('━'.repeat(60))

// Verify required env vars
if (!process.env.DATABASE_URL || !process.env.DIRECT_URL) {
  console.error('\n❌ Missing required environment variables')
  console.error('   Required: DATABASE_URL, DIRECT_URL')
  console.error('\n💡 Configure them in Vercel Dashboard:')
  console.error('   Settings → Environment Variables')
  process.exit(1)
}

console.log('\n📊 Environment:')
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'production'}`)
console.log(`   VERCEL_ENV: ${process.env.VERCEL_ENV || 'N/A'}`)
console.log('   Database configuration: loaded')

// Step 1: Apply migrations (uses DIRECT_URL)
run('pnpm', ['exec', 'prisma', 'migrate', 'deploy'], 'Applying database migrations')

// Step 2: Generate Prisma Client
run('pnpm', ['exec', 'prisma', 'generate'], 'Generating Prisma Client')

// Step 3: Build Next.js application. Content is never seeded during deployment.
run('pnpm', ['exec', 'next', 'build'], 'Building Next.js application')

console.log('\n' + '━'.repeat(60))
console.log('✅ BUILD COMPLETED SUCCESSFULLY! 🎉')
console.log('━'.repeat(60) + '\n')
