export default function LocaleLoading() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-[1440px] animate-pulse px-4 py-16 sm:px-8 lg:px-16">
      <div className="h-3 w-28 bg-white/10" />
      <div className="mt-6 h-16 max-w-3xl bg-white/10" />
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="aspect-[4/3] border border-white/10 bg-white/[0.04]" />
        ))}
      </div>
    </main>
  )
}
