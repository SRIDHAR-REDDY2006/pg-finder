import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../utils/api'

const AddPG = () => {
  const [form, setForm] = useState({
    title: '', description: '', price: '', address: '',
    city: '', gender: 'boys', amenities: '', phone: ''
  })
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      Object.keys(form).forEach(key => formData.append(key, form[key]))
      images.forEach(img => formData.append('images', img))
      await API.post('/pg', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add PG')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Add New PG Listing</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} name='title' placeholder='PG Title' onChange={handleChange} />
        <textarea style={styles.textarea} name='description' placeholder='Description' onChange={handleChange} />
        <input style={styles.input} name='price' type='number' placeholder='Monthly Rent (₹)' onChange={handleChange} />
        <input style={styles.input} name='address' placeholder='Full Address' onChange={handleChange} />
        <input style={styles.input} name='city' placeholder='City' onChange={handleChange} />
        <input style={styles.input} name='phone' placeholder='Contact Phone Number' onChange={handleChange} />
        <input style={styles.input} name='amenities' placeholder='Amenities (WiFi, Food, AC)' onChange={handleChange} />
        <select style={styles.input} name='gender' onChange={handleChange}>
          <option value='boys'>Boys</option>
          <option value='girls'>Girls</option>
          <option value='mixed'>Mixed</option>
        </select>
        <label style={styles.label}>Upload Images</label>
        <input type='file' multiple accept='image/*' style={styles.input}
          onChange={(e) => setImages([...e.target.files])} />
        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Adding...' : 'Add PG Listing'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center',
    padding: '40px 20px', backgroundColor: '#f5f5f5', minHeight: '90vh' },
  box: { backgroundColor: 'white', padding: '40px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '500px' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#2c3e50' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '15px', height: '100px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#2c3e50', color: 'white',
    border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center', marginBottom: '10px' },
  label: { display: 'block', marginBottom: '5px', color: '#555' }
}

export default AddPG    