import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to='/' style={styles.brand}>🏠 PG Finder</Link>
      <div style={styles.links}>
        {!user ? (
          <>
            <Link to='/login' style={styles.link}>Login</Link>
            <Link to='/register' style={styles.link}>Register</Link>
          </>
        ) : (
          <>
            <span style={styles.welcome}>Hi, {user.name}!</span>
            {user.role === 'owner' && (
              <>
                <Link to='/add-pg' style={styles.link}>Add PG</Link>
                <Link to='/dashboard' style={styles.link}>Dashboard</Link>
              </>
            )}
            {user.role === 'admin' && (
              <Link to='/admin' style={styles.link}>Admin Panel</Link>
            )}
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '15px 30px', backgroundColor: '#2c3e50', color: 'white' },
  brand: { color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: 'bold' },
  links: { display: 'flex', alignItems: 'center', gap: '15px' },
  link: { color: 'white', textDecoration: 'none', fontSize: '16px' },
  welcome: { color: '#f39c12', fontSize: '16px' },
  btn: { backgroundColor: '#e74c3c', color: 'white', border: 'none',
    padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }
}

export default Navbar
