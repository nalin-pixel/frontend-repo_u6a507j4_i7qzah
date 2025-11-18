import { useState } from 'react'

export default function SearchBar({ onFilter }) {
  const [q, setQ] = useState('')
  const [country, setCountry] = useState('')

  const apply = () => {
    onFilter && onFilter({ q, country: country.toUpperCase() })
  }

  return (
    <div className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-4 flex flex-col md:flex-row gap-3 items-center">
      <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search casinos..." className="flex-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white placeholder:text-blue-200/40" />
      <input value={country} onChange={(e)=>setCountry(e.target.value)} placeholder="Country (e.g., US)" className="w-full md:w-40 rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white placeholder:text-blue-200/40" />
      <button onClick={apply} className="w-full md:w-auto rounded-lg bg-white/10 hover:bg-white/15 text-white px-4 py-2 border border-white/10">Apply</button>
    </div>
  )
}
