import { useEffect, useState } from 'react'

export default function SearchBar({ onFilter, initialCountry = '' }) {
  const [q, setQ] = useState('')
  const [country, setCountry] = useState(initialCountry || '')

  useEffect(() => {
    if (!initialCountry && !country) {
      try {
        const guess = (navigator.language || '').split('-')[1]
        if (guess && guess.length === 2) {
          setCountry(guess.toUpperCase())
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const apply = () => {
    onFilter && onFilter({ q, country: country.toUpperCase() })
  }

  const clear = () => {
    setQ('')
    setCountry('')
    onFilter && onFilter({ q: '', country: '' })
  }

  return (
    <div className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-4 flex flex-col md:flex-row gap-3 items-center">
      <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search casinos..." className="flex-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white placeholder:text-blue-200/40" />
      <input value={country} onChange={(e)=>setCountry(e.target.value)} placeholder="Country (e.g., US)" className="w-full md:w-40 rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white placeholder:text-blue-200/40" />
      <div className="flex gap-2 w-full md:w-auto">
        <button onClick={apply} className="flex-1 md:flex-none rounded-lg bg-white/10 hover:bg-white/15 text-white px-4 py-2 border border-white/10">Apply</button>
        <button onClick={clear} className="flex-1 md:flex-none rounded-lg bg-white/5 hover:bg-white/10 text-blue-200 px-4 py-2 border border-white/10">Clear</button>
      </div>
    </div>
  )
}
