import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PGDetail from './pages/PGDetail'
import AddPG from './pages/AddPG'
import OwnerDashboard from './pages/OwnerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/pg/:id' element={<PGDetail />} />
        <Route path='/add-pg' element={<AddPG />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
<Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/dashboard' element={<OwnerDashboard />} />
      </Routes>
    </>
  )
}

export default App