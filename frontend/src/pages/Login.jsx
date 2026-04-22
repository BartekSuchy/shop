import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login({ setToken, setRole }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) return setError(data.error)
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        setToken(data.token)
        setRole(data.role)
        navigate('/')
      })
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Logowanie</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }} />
      <input placeholder="Hasło" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }} />
      <button onClick={handleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>Zaloguj</button>
    </div>
  )
}

export default Login