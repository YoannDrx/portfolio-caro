/* eslint-disable no-console */
import { z } from 'zod'

import { auth } from '../../lib/auth'
import { prisma } from '../../lib/prisma'

const inputSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(20),
})

async function main() {
  const input = inputSchema.parse({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  })

  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  })

  if (existingUser) {
    throw new Error('Admin bootstrap refused: an account already exists for this address.')
  }

  const result = await auth.api.signUpEmail({
    body: {
      email: input.email,
      password: input.password,
      name: 'Administration',
    },
  })

  await prisma.user.update({
    where: { id: result.user.id },
    data: {
      role: 'ADMIN',
      emailVerified: true,
      isActive: true,
    },
  })

  console.log('Admin bootstrap completed successfully.')
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Admin bootstrap failed.')
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
