import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleRegister = () => {
    fetch('http://localhost:3002/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) return setMessage(data.error)
        setMessage('Zarejestrowano! Możesz się zalogować.')
        setTimeout(() => navigate('/login'), 1500)
      })
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Rejestracja</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }} />
      <input placeholder="Hasło" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }} />
      <button onClick={handleRegister} style={{ padding: '10px 20px', cursor: 'pointer' }}>Zarejestruj</button>
    </div>
  )
}

export default Register