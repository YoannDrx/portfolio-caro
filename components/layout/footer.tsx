type FooterProps = {
  text: string
}

export function Footer({ text }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="flex flex-col gap-4 text-xs tracking-[0.4em] text-white/50 uppercase">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <p>Caroline Senyk © {year} — Music Rights · Copyright · Publishing</p>
      <p className="tracking-[0.22em] text-white/35">{text} · SYNCK, signature historique</p>
    </footer>
  )
}
