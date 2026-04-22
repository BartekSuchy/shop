import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(localStorage.getItem('role'))
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setToken(null)
    setRole(null)
    navigate('/')
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#222', padding: '10px 20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>🛒 Sklep</Link>
        <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>Koszyk</Link>
        {role === 'admin' && <Link to="/admin" style={{ color: 'yellow', textDecoration: 'none' }}>Panel admina</Link>}
        {token
          ? <button onClick={logout} style={{ marginLeft: 'auto', cursor: 'pointer' }}>Wyloguj</button>
          : <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginLeft: 'auto' }}>Logowanie</Link>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Rejestracja</Link>
            </>
        }
      </nav>

      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Products token={token} />} />
          <Route path="/cart" element={<Cart token={token} />} />
          <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin token={token} role={role} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App