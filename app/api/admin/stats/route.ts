import { NextResponse } from 'next/server'

import { getDashboardStats } from '@/lib/admin/dashboard-stats'
import { withAuth } from '@/lib/api/with-auth'

export const GET = withAuth(async () => {
  return NextResponse.json(await getDashboardStats())
})
