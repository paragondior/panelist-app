import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import loginBackground from '../assets/loginbackground.jpg'
function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  const navigate = useNavigate()
  const location = useLocation()
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await login(credentials)
      navigate(location.state?.from?.pathname || '/admin', { replace: true })
    } catch {
      // The store exposes the user-facing error.
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center  bg-cover bg-center px-6 py-16"
     style={{backgroundImage: `url(${loginBackground})`}}>
    
     <div className="flex h-[500px] w-full max-w-md backdrop-blur-xl flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/30">
        <h1 className="text-3xl font-semibold">Login</h1>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">
          Email
          <input
            className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2"
            type="email"
            value={credentials.email}
            onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2"
            type="password"
            value={credentials.password}
            onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
            required
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="  mx-auto flex  items-center justify-center rounded bg-slate-900 px-8 py-2 text-white disabled:opacity-50" disabled={isLoading} type="submit">
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
        
      </form>
      </div>
      
    </section>
  )
}

export default LoginPage