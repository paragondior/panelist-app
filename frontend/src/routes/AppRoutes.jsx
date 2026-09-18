import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import PublicLayout from '../layouts/PublicLayout'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import LoginPage from '../pages/LoginPage'
import PublicDashboardPage from '../pages/PublicDashboardPage'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<PublicDashboardPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />} path="admin">
          <Route index element={<AdminDashboardPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default AppRoutes