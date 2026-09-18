import { Outlet } from 'react-router-dom'

function PublicLayout() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Outlet />
    </main>
  )
}

export default PublicLayout