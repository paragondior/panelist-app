import { useAuthStore } from '../../store/auth.store'

function AdminHeader() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Operations console</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Control the room, the running order, and the live conversation.</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">{user?.name || 'Administrator'}</span>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={logout} type="button">Sign out</button>
      </div>
    </header>
  )
}

export default AdminHeader