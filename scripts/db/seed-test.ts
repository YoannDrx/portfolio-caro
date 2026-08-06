/** Seed an isolated test database. Environment variables must be injected by CI. */
import { log, runPrismaSeed, runScript, validateEnv } from './utils'

runScript('seed-test', () => {
  log.header('Seed TEST Database')
  validateEnv()
  log.db(process.env.DATABASE_URL ?? '')
  runPrismaSeed('test')
  log.success('Test database seeded!')
})
