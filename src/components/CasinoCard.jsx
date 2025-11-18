export default function CasinoCard({ item, onClick }) {
  return (
    <div className="group rounded-2xl border border-blue-500/20 bg-slate-800/40 p-5 hover:border-blue-400/40 transition-colors">
      <div className="flex items-center gap-4">
        <img src={item.logo_url || 'https://placehold.co/80x80/png'} alt={item.name} className="w-16 h-16 rounded-lg object-contain bg-white/5" />
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">{item.name}</h3>
          <p className="text-blue-200/80 text-sm">{item.bonus_text || 'Welcome bonus available'}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.features?.slice(0,3).map((f, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-200/80">{f}</span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-yellow-300 font-semibold">⭐ {Number(item.base_score || 4).toFixed(1)}</div>
          <button onClick={() => onClick?.(item)} className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-sm">
            Play Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
