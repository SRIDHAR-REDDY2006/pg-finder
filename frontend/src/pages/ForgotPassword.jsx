import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email'); return }
    setLoading(true)
    try {
      const { data } = await API.post('/auth/forgot-password', { email })
      setMessage(data.message)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Forgot Password?</h2>
        <p style={styles.subtitle}>Enter your email and we'll send you a reset link</p>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <input style={styles.input} type='email' placeholder='Enter your email'
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p style={styles.text}><Link to='/login'>Back to Login</Link></p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center',
    alignItems: 'center', minHeight: '90vh', backgroundColor: '#f5f5f5' },
  box: { backgroundColor: 'white', padding: '40px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' },
  title: { color: '#2c3e50', marginBottom: '10px' },
  subtitle: { color: '#7f8c8d', marginBottom: '20px', fontSize: '14px' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#2c3e50', color: 'white',
    border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' },
  success: { color: '#27ae60', marginBottom: '15px', fontSize: '14px' },
  error: { color: '#e74c3c', marginBottom: '15px', fontSize: '14px' },
  text: { marginTop: '15px' }
}

export default ForgotPassword