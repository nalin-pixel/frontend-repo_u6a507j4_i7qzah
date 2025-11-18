import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

export default function Admin() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const { token } = useAuth()

  const [casino, setCasino] = useState({
    name: '', slug: '', affiliate_url: '', logo_url: '', bonus_text: '',
    features: '', supported_countries: '', base_score: 4.0,
    pros: '', cons: '', payment_methods: '', providers: '',
    seo_title: '', seo_description: '', is_published: true
  })
  const [offer, setOffer] = useState({
    casino_slug: '', title: '', description: '', bonus_amount: '', wagering: '', code: ''
  })
  const [casinos, setCasinos] = useState([])
  const [loadingList, setLoadingList] = useState(false)

  const headersJSON = () => {
    const h = { 'Content-Type': 'application/json' }
    if (token) h['Authorization'] = `Bearer ${token}`
    const secret = import.meta.env.VITE_ADMIN_SECRET
    if (!token && secret) h['x-admin-secret'] = secret
    return h
  }

  const resetCasinoForm = () => setCasino({ name: '', slug: '', affiliate_url: '', logo_url: '', bonus_text: '', features: '', supported_countries: '', base_score: 4.0, pros: '', cons: '', payment_methods: '', providers: '', seo_title: '', seo_description: '', is_published: true })
  const resetOfferForm = () => setOffer({ casino_slug: '', title: '', description: '', bonus_amount: '', wagering: '', code: '' })

  const fetchCasinos = async () => {
    try {
      setLoadingList(true)
      const res = await fetch(`${baseUrl}/api/casinos?page_size=50&sort=name_asc`)
      const data = await res.json()
      setCasinos(data.items || [])
    } catch (e) {
      setCasinos([])
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    fetchCasinos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toArrays = (v) => v ? v.split(',').map(s=>s.trim()).filter(Boolean) : []

  const submitCasino = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...casino,
        features: toArrays(casino.features),
        supported_countries: toArrays(casino.supported_countries).map(c=>c.toUpperCase()),
        base_score: Number(casino.base_score),
        pros: toArrays(casino.pros),
        cons: toArrays(casino.cons),
        payment_methods: toArrays(casino.payment_methods),
        providers: toArrays(casino.providers),
        is_published: Boolean(casino.is_published),
      }
      let url = `${baseUrl}/api/seed/casino`
      let method = 'POST'
      if (token) {
        url = `${baseUrl}/api/admin/casinos`
        method = 'POST'
      }
      const res = await fetch(url, { method, headers: headersJSON(), body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed to create casino')
      resetCasinoForm()
      await fetchCasinos()
      alert('Casino created')
    } catch (err) {
      alert(err.message)
    }
  }

  const loadForEdit = (c) => {
    setCasino({
      name: c.name || '',
      slug: c.slug || '',
      affiliate_url: c.affiliate_url || '',
      logo_url: c.logo_url || '',
      bonus_text: c.bonus_text || '',
      features: (c.features || []).join(', '),
      supported_countries: (c.supported_countries || []).join(', '),
      base_score: c.base_score ?? 4.0,
      pros: (c.pros || []).join(', '),
      cons: (c.cons || []).join(', '),
      payment_methods: (c.payment_methods || []).join(', '),
      providers: (c.providers || []).join(', '),
      seo_title: c.seo_title || '',
      seo_description: c.seo_description || '',
      is_published: Boolean(c.is_published ?? true),
    })
  }

  const updateCasino = async (e) => {
    e.preventDefault()
    if (!token) return alert('Sign in to update')
    try {
      const payload = {
        ...casino,
        features: toArrays(casino.features),
        supported_countries: toArrays(casino.supported_countries).map(c=>c.toUpperCase()),
        base_score: Number(casino.base_score),
        pros: toArrays(casino.pros),
        cons: toArrays(casino.cons),
        payment_methods: toArrays(casino.payment_methods),
        providers: toArrays(casino.providers),
        is_published: Boolean(casino.is_published),
      }
      const res = await fetch(`${baseUrl}/api/admin/casinos/${encodeURIComponent(casino.slug)}`, {
        method: 'PUT', headers: headersJSON(), body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Update failed')
      await fetchCasinos()
      alert('Casino updated')
    } catch (err) {
      alert(err.message)
    }
  }

  const submitOffer = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${baseUrl}/api/offers`, {
        method: 'POST', headers: headersJSON(), body: JSON.stringify(offer)
      })
      if (!res.ok) throw new Error('Failed to create offer (make sure casino exists)')
      resetOfferForm()
      alert('Offer created')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-blue-200/80">{token ? 'Signed in' : 'Limited demo mode'}</p>
        </div>
        <p className="text-blue-200/80">Create and update casinos and add offers. Signed-in admins use secure endpoints; without sign-in, you can only seed demo content.</p>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-5">
              <h2 className="text-white font-semibold mb-3">Create / Edit Casino</h2>
              <form className="space-y-3" onSubmit={submitCasino}>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-blue-200/80">Name</label>
                    <input value={casino.name} onChange={e=>setCasino({...casino, name:e.target.value})} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-blue-200/80">Slug</label>
                    <input value={casino.slug} onChange={e=>setCasino({...casino, slug:e.target.value})} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-blue-200/80">Affiliate URL</label>
                    <input value={casino.affiliate_url} onChange={e=>setCasino({...casino, affiliate_url:e.target.value})} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-blue-200/80">Logo URL</label>
                    <input value={casino.logo_url} onChange={e=>setCasino({...casino, logo_url:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-blue-200/80">Bonus Text</label>
                  <input value={casino.bonus_text} onChange={e=>setCasino({...casino, bonus_text:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-blue-200/80">Features (comma)</label>
                    <input value={casino.features} onChange={e=>setCasino({...casino, features:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-blue-200/80">Countries (comma)</label>
                    <input value={casino.supported_countries} onChange={e=>setCasino({...casino, supported_countries:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm text-blue-200/80">Base Score (0-5)</label>
                    <input type="number" min="0" max="5" step="0.1" value={casino.base_score} onChange={e=>setCasino({...casino, base_score:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-blue-200/80">Providers (comma)</label>
                    <input value={casino.providers} onChange={e=>setCasino({...casino, providers:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-blue-200/80">Payment Methods (comma)</label>
                    <input value={casino.payment_methods} onChange={e=>setCasino({...casino, payment_methods:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-emerald-200/80">Pros (comma)</label>
                    <input value={casino.pros} onChange={e=>setCasino({...casino, pros:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-rose-200/80">Cons (comma)</label>
                    <input value={casino.cons} onChange={e=>setCasino({...casino, cons:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-blue-200/80">SEO Title</label>
                    <input value={casino.seo_title} onChange={e=>setCasino({...casino, seo_title:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-blue-200/80">SEO Description</label>
                    <input value={casino.seo_description} onChange={e=>setCasino({...casino, seo_description:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input id="published" type="checkbox" checked={!!casino.is_published} onChange={(e)=>setCasino({...casino, is_published: e.target.checked})} />
                  <label htmlFor="published" className="text-sm text-blue-200/80">Published</label>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">Create</button>
                  <button onClick={updateCasino} className="rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-4 py-2" disabled={!token}>Update</button>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-5">
              <h2 className="text-white font-semibold mb-3">Create Offer</h2>
              <form className="space-y-3" onSubmit={submitOffer}>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-blue-200/80">Casino Slug</label>
                    <input value={offer.casino_slug} onChange={e=>setOffer({...offer, casino_slug:e.target.value})} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-blue-200/80">Title</label>
                    <input value={offer.title} onChange={e=>setOffer({...offer, title:e.target.value})} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-blue-200/80">Description</label>
                  <input value={offer.description} onChange={e=>setOffer({...offer, description:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
                </div>
                <div className="grid md:grid-cols-3 gap-3">
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
                </div>
                <button type="submit" className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2">Create Offer</button>
              </form>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold">Casinos</h2>
                <button onClick={fetchCasinos} className="text-sm rounded-lg bg-white/10 hover:bg-white/15 text-white px-3 py-1.5 border border-white/10">Refresh</button>
              </div>
              {loadingList ? (
                <p className="text-sm text-blue-200/80 mt-3">Loading...</p>
              ) : (
                <ul className="mt-3 space-y-2 max-h-[420px] overflow-auto pr-1">
                  {casinos.length === 0 && <li className="text-sm text-blue-200/70">No casinos yet.</li>}
                  {casinos.map(c => (
                    <li key={c.id} className="rounded-lg border border-white/10 bg-slate-900/40 p-3">
                      <div className="flex items-center gap-3">
                        <img src={c.logo_url || 'https://placehold.co/40x40/png'} alt={c.name} className="w-10 h-10 rounded bg-white/5 object-contain" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{c.name}</p>
                          <p className="text-xs text-blue-200/60 truncate">{c.slug}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${c.is_published ? 'bg-emerald-500/10 text-emerald-200/90' : 'bg-amber-500/10 text-amber-200/90'}`}>{c.is_published ? 'Published' : 'Draft'}</span>
                        <button onClick={()=>loadForEdit(c)} className="text-sm rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-100 px-2 py-1 border border-blue-500/30">Edit</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
