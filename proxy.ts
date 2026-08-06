import { type NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protéger toutes les routes /[locale]/admin/*
  if (/^\/(fr|en)\/admin/.exec(pathname)) {
    try {
      // Vérifier la session avec BetterAuth
      const session = await auth.api.getSession({
        headers: request.headers,
      })

      // Si pas de session, rediriger vers la page d'accueil
      if (!session?.user) {
        const locale = pathname.split('/')[1] ?? 'fr'
        const redirectUrl = new URL(`/${locale}`, request.url)
        redirectUrl.searchParams.set('login', 'required')
        return NextResponse.redirect(redirectUrl)
      }

      // Vérifier que l'utilisateur est actif
      if (!session.user.isActive) {
        const locale = pathname.split('/')[1] ?? 'fr'
        const redirectUrl = new URL(`/${locale}`, request.url)
        redirectUrl.searchParams.set('error', 'inactive')
        return NextResponse.redirect(redirectUrl)
      }

      // Vérifier le rôle ADMIN
      if (session.user.role !== 'ADMIN') {
        const locale = pathname.split('/')[1] ?? 'fr'
        const redirectUrl = new URL(`/${locale}`, request.url)
        redirectUrl.searchParams.set('error', 'unauthorized')
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Proxy auth error:', error)
      const locale = pathname.split('/')[1] ?? 'fr'
      const redirectUrl = new URL(`/${locale}`, request.url)
      redirectUrl.searchParams.set('error', 'auth_error')
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/fr/admin/:path*', '/en/admin/:path*'],
}
