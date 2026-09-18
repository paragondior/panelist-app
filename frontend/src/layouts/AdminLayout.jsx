import { Link, Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="border-b border-slate-200 bg-white px-6 py-4">
        <Link className="font-semibold" to="/admin">
          Panelist Admin
        </Link>
      </nav>
      <section className="p-6">
        <Outlet />
      </section>
    </main>
  )
}

export default AdminLayout