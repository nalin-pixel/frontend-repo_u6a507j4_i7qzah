import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/Header'
import CasinoCard from './components/CasinoCard'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ q: '', country: '' })
  const [page, setPage] = useState(1)
  const [pageSize] = useState(8)
  const [sort, setSort] = useState('name_asc')
  const [pagination, setPagination] = useState({ page: 1, page_size: pageSize, total: 0, pages: 1 })
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const navigate = useNavigate()

  const fetchCasinos = async ({ country, q, page: p, pageSize: ps, sort: s }) => {
    try {
      setLoading(true)
      const url = new URL(`${baseUrl}/api/casinos`)
      if (country) url.searchParams.set('country', country)
      if (q) url.searchParams.set('q', q)
      if (p) url.searchParams.set('page', String(p))
      if (ps) url.searchParams.set('page_size', String(ps))
      if (s) url.searchParams.set('sort', s)
      const res = await fetch(url)
      const data = await res.json()
      setItems(data.items || [])
      if (data.pagination) setPagination(data.pagination)
      setError('')
    } catch (e) {
      setError('Failed to load casinos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCasinos({ country: filters.country, q: filters.q, page, pageSize, sort })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.country, filters.q, page, pageSize, sort])

  const onPlayNow = async (item) => {
    try {
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

  const onFilter = (f) => {
    setFilters(f)
    setPage(1) // reset pagination on filter change
  }

  const canPrev = page > 1
  const canNext = page < (pagination.pages || 1)

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

          <div className="mt-8">
            <SearchBar onFilter={onFilter} />
          </div>

          <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-blue-200/70">{pagination.total} result(s)</p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-blue-200/70">Sort by</label>
              <select value={sort} onChange={(e)=>setSort(e.target.value)} className="rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white">
                <option value="name_asc">Name (A–Z)</option>
                <option value="name_desc">Name (Z–A)</option>
                <option value="score_desc">Score (High→Low)</option>
                <option value="score_asc">Score (Low→High)</option>
              </select>
            </div>
          </div>

          <div id="top-casinos" className="mt-6 grid md:grid-cols-2 gap-5">
            {loading && (
              <div className="col-span-2 text-center text-blue-200/80">Loading casinos...</div>
            )}
            {error && (
              <div className="col-span-2 text-center text-red-400">{error}</div>
            )}
            {!loading && !error && items.length === 0 && (
              <div className="col-span-2 text-center text-blue-200/80">No casinos found. Try seeding demo data.</div>
            )}
            {items.map((item) => (
              <div key={item.id} className="cursor-pointer" onClick={()=>navigate(`/casino/${item.slug}`)}>
                <CasinoCard item={item} onClick={onPlayNow} />
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button disabled={!canPrev} onClick={()=> canPrev && setPage(p=>p-1)} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 border border-white/10 ${canPrev ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-white/5 text-blue-300/60 cursor-not-allowed'}`}>
              ← Previous
            </button>
            <div className="text-sm text-blue-200/80">Page {pagination.page} of {pagination.pages}</div>
            <button disabled={!canNext} onClick={()=> canNext && setPage(p=>p+1)} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 border border-white/10 ${canNext ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-white/5 text-blue-300/60 cursor-not-allowed'}`}>
              Next →
            </button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="#how-it-works" className="text-sm text-blue-200/80 hover:text-white">How we rate</a>
            <span className="text-blue-200/40">•</span>
            <button onClick={async () => {
              const headers = { 'Content-Type': 'application/json' }
              const secret = import.meta.env.VITE_ADMIN_SECRET
              if (secret) headers['x-admin-secret'] = secret
              await fetch(`${baseUrl}/api/seed/casino`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                  name: 'Example Casino',
                  slug: 'example-casino',
                  affiliate_url: 'https://example.com',
                  logo_url: 'https://placehold.co/96x96/png',
                  bonus_text: '100% up to $500 + 100 FS',
                  features: ['Fast payouts','Mobile app','2000+ games'],
                  supported_countries: ['US','CA','GB'],
                  base_score: 4.4,
                  pros: ['Fast withdrawals','Great UX','Live chat support'],
                  cons: ['Limited table games'],
                  payment_methods: ['Visa','Mastercard','PayPal'],
                  providers: ['NetEnt','Pragmatic Play','Playtech']
                })
              })
              fetchCasinos({ country: filters.country, q: filters.q, page, pageSize, sort })
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
