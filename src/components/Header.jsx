import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header({ onToggleMenu }) {
  const [open, setOpen] = useState(false)
  const toggle = () => {
    setOpen(!open)
    onToggleMenu && onToggleMenu(!open)
  }
  return (
    <header className="relative z-20 border-b border-white/10 bg-slate-900/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <span className="text-white font-semibold text-lg">BlueBet Guides</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-blue-100/80">
          <a className="hover:text-white" href="#top-casinos">Top Casinos</a>
          <a className="hover:text-white" href="#bonuses">Bonuses</a>
          <a className="hover:text-white" href="#how-it-works">How It Works</a>
          <Link to="/test" className="hover:text-white">Status</Link>
          <Link to="/admin" className="hover:text-white">Admin</Link>
        </nav>
        <button onClick={toggle} className="md:hidden text-white/80 hover:text-white" aria-label="Toggle menu">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-2 text-blue-100/80">
          <a className="block hover:text-white" href="#top-casinos">Top Casinos</a>
          <a className="block hover:text-white" href="#bonuses">Bonuses</a>
          <a className="block hover:text-white" href="#how-it-works">How It Works</a>
          <Link to="/test" className="block hover:text-white">Status</Link>
          <Link to="/admin" className="block hover:text-white">Admin</Link>
        </div>
      )}
    </header>
  )
}
