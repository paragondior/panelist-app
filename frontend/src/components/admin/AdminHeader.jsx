import { useAuthStore } from '../../store/auth.store'

function AdminHeader() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Operations console</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Control the room, the running order, and the live conversation.</p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
          {user?.name || 'Administrator'}
        </div>
        <button
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          onClick={logout}
          type="button"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}

export default AdminHeader