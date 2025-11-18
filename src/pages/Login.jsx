import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Login() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <Header />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center">Sign in</h1>
        <p className="text-center text-blue-200/80 mt-2">Admin access is required to manage content.</p>

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
          <button disabled={loading} type="submit" className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white px-4 py-2">{loading ? 'Signing in...' : 'Sign in'}</button>
          <p className="text-center text-sm text-blue-200/70">No admin yet? Seed one via CLI or API using your secret.</p>
        </form>
      </main>
      <Footer />
    </div>
  )
}
