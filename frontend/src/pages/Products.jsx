import { useState, useEffect } from 'react'

function Products({ token }) {
  const [products, setProducts] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:3002/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  const addToCart = (product_id) => {
    if (!token) return setMessage('Musisz być zalogowany!')

    fetch('http://localhost:3002/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ product_id })
    })
      .then(res => res.json())
      .then(() => setMessage('Dodano do koszyka!'))
      setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div>
      <h2>Produkty</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {products.length === 0 && <p>Brak produktów. Admin musi dodać pierwsze produkty.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
            {p.image_url && <img src={`http://localhost:3002${p.image_url}`} alt={p.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} />}
            <h3>{p.name}</h3>
            <p style={{ color: '#666' }}>{p.description}</p>
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{p.price} zł</p>
            <p style={{ color: p.stock > 0 ? 'green' : 'red' }}>{p.stock > 0 ? `Na stanie: ${p.stock}` : 'Brak w magazynie'}</p>
            <button onClick={() => addToCart(p.id)} disabled={p.stock === 0} style={{ padding: '8px 16px', cursor: 'pointer', width: '100%', marginTop: '10px' }}>
              Dodaj do koszyka
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products