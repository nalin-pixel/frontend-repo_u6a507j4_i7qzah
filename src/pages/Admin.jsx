import { useMemo, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Admin() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  const [casino, setCasino] = useState({
    name: '', slug: '', affiliate_url: '', logo_url: '', bonus_text: '',
    features: '', supported_countries: '', base_score: 4.0
  })
  const [offer, setOffer] = useState({
    casino_slug: '', title: '', description: '', bonus_amount: '', wagering: '', code: ''
  })

  const submitCasino = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...casino,
        features: casino.features ? casino.features.split(',').map(s=>s.trim()).filter(Boolean) : [],
        supported_countries: casino.supported_countries ? casino.supported_countries.split(',').map(s=>s.trim().toUpperCase()).filter(Boolean) : [],
        base_score: Number(casino.base_score)
      }
      const res = await fetch(`${baseUrl}/api/seed/casino`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create casino')
      setCasino({ name: '', slug: '', affiliate_url: '', logo_url: '', bonus_text: '', features: '', supported_countries: '', base_score: 4.0 })
      alert('Casino created')
    } catch (err) {
      alert(err.message)
    }
  }

  const submitOffer = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${baseUrl}/api/offers`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(offer)
      })
      if (!res.ok) throw new Error('Failed to create offer (make sure casino exists)')
      setOffer({ casino_slug: '', title: '', description: '', bonus_amount: '', wagering: '', code: '' })
      alert('Offer created')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Simple Admin</h1>
        <p className="text-blue-200/80">Create casinos and offers. This lightweight panel has no authentication and is for demo use only.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-5">
            <h2 className="text-white font-semibold mb-3">Create Casino</h2>
            <form className="space-y-3" onSubmit={submitCasino}>
              <div>
                <label className="text-sm text-blue-200/80">Name</label>
                <input value={casino.name} onChange={e=>setCasino({...casino, name:e.target.value})} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-blue-200/80">Slug</label>
                <input value={casino.slug} onChange={e=>setCasino({...casino, slug:e.target.value})} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-blue-200/80">Affiliate URL</label>
                <input value={casino.affiliate_url} onChange={e=>setCasino({...casino, affiliate_url:e.target.value})} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-blue-200/80">Logo URL</label>
                <input value={casino.logo_url} onChange={e=>setCasino({...casino, logo_url:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-blue-200/80">Bonus Text</label>
                <input value={casino.bonus_text} onChange={e=>setCasino({...casino, bonus_text:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-blue-200/80">Features (comma separated)</label>
                <input value={casino.features} onChange={e=>setCasino({...casino, features:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-blue-200/80">Countries (comma separated)</label>
                <input value={casino.supported_countries} onChange={e=>setCasino({...casino, supported_countries:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-blue-200/80">Base Score (0-5)</label>
                <input type="number" min="0" max="5" step="0.1" value={casino.base_score} onChange={e=>setCasino({...casino, base_score:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <button type="submit" className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">Create Casino</button>
            </form>
          </section>

          <section className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-5">
            <h2 className="text-white font-semibold mb-3">Create Offer</h2>
            <form className="space-y-3" onSubmit={submitOffer}>
              <div>
                <label className="text-sm text-blue-200/80">Casino Slug</label>
                <input value={offer.casino_slug} onChange={e=>setOffer({...offer, casino_slug:e.target.value})} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-blue-200/80">Title</label>
                <input value={offer.title} onChange={e=>setOffer({...offer, title:e.target.value})} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-blue-200/80">Description</label>
                <input value={offer.description} onChange={e=>setOffer({...offer, description:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-blue-200/80">Bonus Amount</label>
                <input value={offer.bonus_amount} onChange={e=>setOffer({...offer, bonus_amount:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-blue-200/80">Wagering</label>
                <input value={offer.wagering} onChange={e=>setOffer({...offer, wagering:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-blue-200/80">Code</label>
                <input value={offer.code} onChange={e=>setOffer({...offer, code:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
              </div>
              <button type="submit" className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2">Create Offer</button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
