import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../utils/api'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || !confirm) { setError('Please fill all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }

    setLoading(true)
    try {
      const { data } = await API.post('/auth/reset-password', { token, password })
      setMessage(data.message)
      setError('')
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>Enter your new password below</p>

        {message && <p style={styles.success}>{message} Redirecting to login...</p>}
        {error && <p style={styles.error}>{error}</p>}

        <input style={styles.input} type='password'
          placeholder='New Password (min 6 characters)'
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <input style={styles.input} type='password'
          placeholder='Confirm New Password'
          value={confirm} onChange={(e) => setConfirm(e.target.value)} />

        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
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
}

export default ResetPassword    