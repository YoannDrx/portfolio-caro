import { revalidatePath } from 'next/cache'

import 'server-only'

type PublicEntity = 'artist' | 'project' | 'expertise' | 'taxonomy' | 'asset'

export function revalidatePublicContent(entity: PublicEntity, slug?: string) {
  for (const locale of ['fr', 'en'] as const) {
    revalidatePath(`/${locale}`)

    if (entity === 'artist') {
      revalidatePath(`/${locale}/artistes`)
      if (slug) revalidatePath(`/${locale}/artistes/${slug}`)
      revalidatePath(`/${locale}/projets`)
    }

    if (entity === 'project' || entity === 'taxonomy') {
      revalidatePath(`/${locale}/projets`)
      revalidatePath(`/${locale}/artistes`)
      if (entity === 'project' && slug) revalidatePath(`/${locale}/projets/${slug}`)
    }

    if (entity === 'expertise') {
      revalidatePath(`/${locale}/expertises`)
      if (slug) revalidatePath(`/${locale}/expertises/${slug}`)
    }

    if (entity === 'asset') {
      revalidatePath(`/${locale}`, 'layout')
    }
  }
}
