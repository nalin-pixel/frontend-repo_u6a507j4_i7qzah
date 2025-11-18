export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-900/60">
      <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-3 gap-6 text-blue-200/80">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src="/flame-icon.svg" className="w-6 h-6" />
            <span className="text-white font-semibold">BlueBet Guides</span>
          </div>
          <p className="text-sm">We help players discover trusted casinos, compare bonuses, and play responsibly.</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#top-casinos" className="hover:text-white">Top Casinos</a></li>
            <li><a href="#bonuses" className="hover:text-white">Bonuses</a></li>
            <li><a href="#how-it-works" className="hover:text-white">How it works</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Responsible Gaming</p>
          <p className="text-sm">Please gamble responsibly. Must be of legal age in your jurisdiction. This website contains affiliate links.</p>
        </div>
      </div>
      <div className="text-center text-xs text-blue-200/60 pb-6">© {new Date().getFullYear()} BlueBet Guides • All rights reserved</div>
    </footer>
  )
}
