import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        await register(email, password)
      } else {
        await login(email, password)
      }
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <Header />
      <main className="mx-auto max-w-md px-4 py-12">
        <div className="flex items-center justify-center gap-2 mb-6">
          <button onClick={() => setMode('login')} className={`px-4 py-2 rounded-lg border ${mode==='login' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/10 border-white/10 text-blue-100'}`}>Sign in</button>
          <button onClick={() => setMode('register')} className={`px-4 py-2 rounded-lg border ${mode==='register' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/10 border-white/10 text-blue-100'}`}>Sign up</button>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white text-center">{mode==='register' ? 'Create your admin' : 'Sign in'}</h1>
        <p className="text-center text-blue-200/80 mt-2">Use your email and password. No secrets needed.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-blue-200/80">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-sm text-blue-200/80">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="mt-1 w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white" />
          </div>
          {error && <div className="text-sm text-rose-400">{error}</div>}
          <button disabled={loading} type="submit" className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white px-4 py-2">{loading ? (mode==='register' ? 'Creating account...' : 'Signing in...') : (mode==='register' ? 'Create account' : 'Sign in')}</button>
        </form>
      </main>
      <Footer />
    </div>
  )
}
