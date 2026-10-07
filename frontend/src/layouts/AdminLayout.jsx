import { Link, Outlet } from 'react-router-dom'
import './AdminLayout.css'

function AdminLayout() {
  return (
    <main className="admin-layout min-h-screen text-slate-100">
      <nav className="admin-layout-nav border-b px-6 py-4">
        <Link className="font-semibold" to="/admin">
          Panelist Admin
        </Link>
      </nav>
      <section className="admin-layout-content p-6">
        <Outlet />
      </section>
    </main>
  )
}

export default AdminLayout