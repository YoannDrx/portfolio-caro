/* eslint-disable no-console */
import { z } from 'zod'

import { prisma } from '../../lib/prisma'

const inputSchema = z.object({
  confirmation: z.literal('INVALIDATE_ADMIN_SESSIONS'),
})

async function main() {
  inputSchema.parse({
    confirmation: process.env.CONFIRM_SESSION_INVALIDATION,
  })

  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN', isActive: true },
    select: { id: true },
  })

  if (admins.length === 0) {
    throw new Error('Session invalidation refused: no active admin account found.')
  }

  const result = await prisma.session.deleteMany({
    where: { userId: { in: admins.map((admin) => admin.id) } },
  })
  console.log(`Admin sessions invalidated: ${String(result.count)}.`)
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Session invalidation failed.')
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
