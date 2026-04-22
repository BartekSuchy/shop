import { useState, useEffect } from 'react'

function Cart({ token }) {
  const [items, setItems] = useState([])

  const fetchCart = () => {
    if (!token) return
    fetch('http://localhost:3002/api/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
  }

  useEffect(() => { fetchCart() }, [token])

  const removeItem = (id) => {
    fetch(`http://localhost:3002/api/cart/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(() => fetchCart())
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!token) return <p>Musisz być zalogowany żeby zobaczyć koszyk.</p>

  return (
    <div>
      <h2>Koszyk</h2>
      {items.length === 0 && <p>Koszyk jest pusty.</p>}
      {items.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
          <div>
            <strong>{item.name}</strong>
            <p>Ilość: {item.quantity} × {item.price} zł</p>
          </div>
          <button onClick={() => removeItem(item.id)} style={{ cursor: 'pointer', color: 'red' }}>Usuń</button>
        </div>
      ))}
      {items.length > 0 && <h3>Razem: {total.toFixed(2)} zł</h3>}
    </div>
  )
}

export default Cart