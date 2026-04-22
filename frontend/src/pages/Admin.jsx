import { useState, useEffect } from 'react'

function Admin({ token, role }) {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', image: null })
  const [message, setMessage] = useState('')

  const fetchProducts = () => {
    fetch('http://localhost:3002/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
  }

  useEffect(() => { fetchProducts() }, [])

  const addProduct = () => {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('price', form.price)
    formData.append('stock', form.stock)
    if (form.image) formData.append('image', form.image)

    fetch('http://localhost:3002/api/products', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) return setMessage(data.error)
        setMessage('Produkt dodany!')
        setForm({ name: '', description: '', price: '', stock: '', image: null })
        fetchProducts()
      })
  }

  const deleteProduct = (id) => {
    fetch(`http://localhost:3002/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(() => fetchProducts())
  }

  if (role !== 'admin') return <p>Brak dostępu.</p>

  return (
    <div>
      <h2>Panel admina</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Dodaj produkt</h3>
        {['name', 'description', 'price', 'stock'].map(field => (
          <input
            key={field}
            placeholder={field}
            value={form[field] || ''}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '8px' }}
          />
        ))}
        <input
          type="file"
          accept="image/*"
          onChange={e => setForm({ ...form, image: e.target.files[0] })}
          style={{ marginBottom: '8px' }}
        />
        <button onClick={addProduct} style={{ padding: '10px 20px', cursor: 'pointer' }}>Dodaj produkt</button>
      </div>

      <h3>Wszystkie produkty</h3>
      {products.map(p => (
        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
          <span>{p.name} — {p.price} zł (stan: {p.stock})</span>
          <button onClick={() => deleteProduct(p.id)} style={{ color: 'red', cursor: 'pointer' }}>Usuń</button>
        </div>
      ))}
    </div>
  )
}

export default Admin