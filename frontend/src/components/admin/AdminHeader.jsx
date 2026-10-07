import { useAuthStore } from '../../store/auth.store'

function AdminHeader() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="admin-dashboard-header flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Operations console</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-300">Control the room, the running order, and the live conversation.</p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <div className="rounded-full border border-cyan-200/15 bg-white/[0.06] px-3 py-1.5 text-sm font-medium text-slate-100 backdrop-blur">
          {user?.name || 'Administrator'}
        </div>
        <button
          className="admin-header-signout rounded-full border border-cyan-200/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-300/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
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