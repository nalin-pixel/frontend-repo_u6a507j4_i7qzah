import { useEffect, useState } from 'react'
import Header from './components/Header'
import CasinoCard from './components/CasinoCard'
import Footer from './components/Footer'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCasinos = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
        const res = await fetch(`${baseUrl}/api/casinos`)
        const data = await res.json()
        setItems(data.items || [])
      } catch (e) {
        setError('Failed to load casinos')
      } finally {
        setLoading(false)
      }
    }
    fetchCasinos()
  }, [])

  const onPlayNow = async (item) => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      await fetch(`${baseUrl}/api/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ casino_slug: item.slug, source: 'listing' })
      })
      window.open(item.affiliate_url, '_blank', 'noopener,noreferrer')
    } catch (e) {
      window.open(item.affiliate_url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <Header />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Find the Best Online Casinos</h1>
            <p className="mt-4 text-blue-200/80 max-w-2xl mx-auto">Compare welcome bonuses, game selection, and payouts. Click Play Now to claim offers. We may earn a commission.</p>
          </div>

          <div id="top-casinos" className="mt-10 grid md:grid-cols-2 gap-5">
            {loading && (
              <div className="col-span-2 text-center text-blue-200/80">Loading casinos...</div>
            )}
            {error && (
              <div className="col-span-2 text-center text-red-400">{error}</div>
            )}
            {!loading && !error && items.length === 0 && (
              <div className="col-span-2 text-center text-blue-200/80">No casinos seeded yet. Use the seed button below to add demo data.</div>
            )}
            {items.map((item) => (
              <CasinoCard key={item.id} item={item} onClick={onPlayNow} />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="#how-it-works" className="text-sm text-blue-200/80 hover:text-white">How we rate</a>
            <span className="text-blue-200/40">•</span>
            <button onClick={async () => {
              const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
              await fetch(`${baseUrl}/api/seed/casino`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: 'Example Casino',
                  slug: 'example-casino',
                  affiliate_url: 'https://example.com',
                  logo_url: 'https://placehold.co/96x96/png',
                  bonus_text: '100% up to $500 + 100 FS',
                  features: ['Fast payouts','Mobile app','2000+ games'],
                  supported_countries: ['US','CA','GB'],
                  base_score: 4.4
                })
              })
              // refresh
              const res = await fetch(`${baseUrl}/api/casinos`)
              const data = await res.json()
              setItems(data.items || [])
            }} className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/15 text-white px-4 py-2 text-sm border border-white/10">
              Seed demo casino
            </button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-white">How we rank casinos</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {[{
            title: 'Safety & Trust',
            desc: 'Licensing, SSL security, and reputation checks ensure safe play.'
          },{
            title: 'Bonuses & Wagering',
            desc: 'Transparent terms and fair wagering so you know what you get.'
          },{
            title: 'Games & Payments',
            desc: 'Large game libraries and fast, reliable payment methods.'
          }].map((b, i) => (
            <div key={i} className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-5">
              <p className="text-white font-semibold">{b.title}</p>
              <p className="text-blue-200/80 text-sm mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default App
