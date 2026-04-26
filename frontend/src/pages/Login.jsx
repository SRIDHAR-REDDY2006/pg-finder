import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    try {
      const { data } = await API.post('/auth/login', form)
      login(data)
      navigate('/')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Login to PG Finder</h2>
        {serverError && <p style={styles.serverError}>{serverError}</p>}

        <input style={errors.email ? styles.inputError : styles.input}
          name='email' placeholder='Email' onChange={handleChange} />
        {errors.email && <p style={styles.error}>{errors.email}</p>}

        <input style={errors.password ? styles.inputError : styles.input}
          name='password' type='password' placeholder='Password'
          onChange={handleChange} />
        {errors.password && <p style={styles.error}>{errors.password}</p>}

        <button style={styles.btn} onClick={handleSubmit}>Login</button>
        <p style={styles.text}>Don't have an account? <Link to='/register'>Register</Link></p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center',
    alignItems: 'center', minHeight: '90vh', backgroundColor: '#f5f5f5' },
  box: { backgroundColor: 'white', padding: '40px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '350px' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#2c3e50' },
  input: { width: '100%', padding: '12px', marginBottom: '5px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' },
  inputError: { width: '100%', padding: '12px', marginBottom: '5px', borderRadius: '5px',
    border: '2px solid #e74c3c', fontSize: '15px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#2c3e50', color: 'white',
    border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
  error: { color: '#e74c3c', fontSize: '12px', marginBottom: '8px', marginTop: '0' },
  serverError: { color: 'red', textAlign: 'center', marginBottom: '10px' },
  text: { textAlign: 'center', marginTop: '15px' }
}

export default Login