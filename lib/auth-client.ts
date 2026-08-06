'use client'

import { createAuthClient } from 'better-auth/react'

// Better Auth is served by this application. Keeping the client same-origin
// prevents preview and Vercel aliases from calling the production hostname.
export const authClient = createAuthClient()

export const { signIn, signUp, signOut, useSession } = authClient
