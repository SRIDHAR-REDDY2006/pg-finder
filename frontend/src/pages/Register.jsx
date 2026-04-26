import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../utils/api'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', phone: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (form.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }

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

    const phoneRegex = /^[6-9]\d{9}$/
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number'
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
      await API.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Create Account</h2>
        {serverError && <p style={styles.serverError}>{serverError}</p>}

        <input style={errors.name ? styles.inputError : styles.input}
          name='name' placeholder='Full Name' onChange={handleChange} />
        {errors.name && <p style={styles.error}>{errors.name}</p>}

        <input style={errors.email ? styles.inputError : styles.input}
          name='email' placeholder='Email' onChange={handleChange} />
        {errors.email && <p style={styles.error}>{errors.email}</p>}

        <input style={errors.password ? styles.inputError : styles.input}
          name='password' type='password' placeholder='Password (min 6 characters)'
          onChange={handleChange} />
        {errors.password && <p style={styles.error}>{errors.password}</p>}

        <input style={errors.phone ? styles.inputError : styles.input}
          name='phone' placeholder='10-digit Mobile Number' onChange={handleChange} />
        {errors.phone && <p style={styles.error}>{errors.phone}</p>}

        <select style={styles.input} name='role' onChange={handleChange}>
          <option value='student'>Student</option>
          <option value='owner'>PG Owner</option>
        </select>

        <button style={styles.btn} onClick={handleSubmit}>Register</button>
        <p style={styles.text}>Already have an account? <Link to='/login'>Login</Link></p>
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

export default Register