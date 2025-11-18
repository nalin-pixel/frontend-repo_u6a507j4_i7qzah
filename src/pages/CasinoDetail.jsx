import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function CasinoDetail() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ user_name: '', rating: 5, comment: '' })
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  const fetchCasino = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/api/casinos/${slug}`)
      if (!res.ok) throw new Error('Failed to load casino')
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCasino()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const onPlay = async () => {
    try {
      await fetch(`${baseUrl}/api/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ casino_slug: slug, source: 'details' })
      })
      window.open(data?.casino?.affiliate_url, '_blank', 'noopener,noreferrer')
    } catch (e) {
      window.open(data?.casino?.affiliate_url, '_blank', 'noopener,noreferrer')
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    try {
      const payload = { casino_slug: slug, ...form, rating: Number(form.rating) }
      const res = await fetch(`${baseUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to submit review')
      setForm({ user_name: '', rating: 5, comment: '' })
      await fetchCasino()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <Link to="/" className="text-sm text-blue-300 hover:text-white">← Back to casinos</Link>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && data && (
          <>
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              <img src={data.casino.logo_url || 'https://placehold.co/120x120/png'} alt={data.casino.name} className="w-24 h-24 rounded-xl bg-white/5 object-contain" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">{data.casino.name}</h1>
                <p className="text-blue-200/80 mt-1">{data.casino.bonus_text || 'Welcome bonus available'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.casino.features?.map((f, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-200/80">{f}</span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-300 font-semibold">⭐ {Number(data.casino.base_score || 4).toFixed(1)}</div>
                <button onClick={onPlay} className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
                  Play Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-6">
              <section className="md:col-span-2 space-y-6">
                <div className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-5">
                  <h2 className="text-white font-semibold text-lg">Available Offers</h2>
                  {data.offers.length === 0 ? (
                    <p className="text-blue-200/80 text-sm mt-2">No offers yet.</p>
                  ) : (
                    <ul className="mt-3 space-y-3">
                      {data.offers.map((o) => (
                        <li key={o.id} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-white font-medium">{o.title}</p>
                              {o.description && <p className="text-blue-200/80 text-sm mt-1">{o.description}</p>}
                              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                {o.bonus_amount && <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-200/90">{o.bonus_amount}</span>}
                                {o.wagering && <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-200/90">Wagering: {o.wagering}</span>}
                                {o.code && <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-200/90">Code: {o.code}</span>}
                              </div>
                            </div>
                            <button onClick={onPlay} className="inline-flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-sm">Claim</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-5">
                  <h2 className="text-white font-semibold text-lg">Player Reviews</h2>
                  {data.reviews.length === 0 ? (
                    <p className="text-blue-200/80 text-sm mt-2">No reviews yet. Be the first!</p>
                  ) : (
                    <ul className="mt-3 space-y-3">
                      {data.reviews.map((r) => (
                        <li key={r.id} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-white font-medium">{r.user_name}</p>
                            <p className="text-yellow-300">⭐ {r.rating}</p>
                          </div>
                          {r.comment && <p className="text-blue-200/80 text-sm mt-2">{r.comment}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <aside className="space-y-6">
                <div className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-5">
                  <h3 className="text-white font-semibold">Write a Review</h3>
                  <form className="mt-3 space-y-3" onSubmit={submitReview}>
                    <div>
                      <label className="text-sm text-blue-200/80">Your name</label>
                      <input value={form.user_name} onChange={(e)=>setForm({...form, user_name:e.target.value})} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white placeholder:text-blue-200/40" placeholder="Jane" />
                    </div>
                    <div>
                      <label className="text-sm text-blue-200/80">Rating</label>
                      <select value={form.rating} onChange={(e)=>setForm({...form, rating:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white">
                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200/80">Comment</label>
                      <textarea value={form.comment} onChange={(e)=>setForm({...form, comment:e.target.value})} rows={4} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" placeholder="Share your experience..." />
                    </div>
                    <button type="submit" className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">Submit Review</button>
                  </form>
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-5">
                  <h3 className="text-white font-semibold">Supported Countries</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.casino.supported_countries?.map((c, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 text-blue-100/80 border border-white/10">{c}</span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
