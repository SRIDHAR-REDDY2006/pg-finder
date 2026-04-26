import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../utils/api'

const OwnerDashboard = () => {
  const [pgs, setPgs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMyPGs = async () => {
      try {
        const { data } = await API.get('/pg/mypgs')
        setPgs(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMyPGs()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PG?')) return
    try {
      await API.delete(`/pg/${id}`)
      setPgs(pgs.filter(pg => pg._id !== id))
    } catch (err) {
      alert('Failed to delete PG')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My PG Listings</h2>
        <button style={styles.addBtn} onClick={() => navigate('/add-pg')}>
          + Add New PG
        </button>
      </div>

      {loading ? (
        <p style={styles.msg}>Loading...</p>
      ) : pgs.length === 0 ? (
        <p style={styles.msg}>You have no PG listings yet. Add one!</p>
      ) : (
        <div style={styles.grid}>
          {pgs.map(pg => (
            <div key={pg._id} style={styles.card}>
              <img src={pg.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={pg.title} style={styles.image} />
              <div style={styles.info}>
                <h3 style={styles.pgTitle}>{pg.title}</h3>
                <p>📍 {pg.city}</p>
                <p>💰 ₹{pg.price}/month</p>
                <p>👤 {pg.gender}</p>
                <p>📞 {pg.phone}</p>
                <div style={styles.actions}>
                  <button style={styles.viewBtn}
                    onClick={() => navigate(`/pg/${pg._id}`)}>View</button>
                  <button style={styles.deleteBtn}
                    onClick={() => handleDelete(pg._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '30px', backgroundColor: '#f5f5f5', minHeight: '90vh' },
  header: { display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '25px' },
  title: { fontSize: '26px', color: '#2c3e50' },
  addBtn: { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '15px' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  card: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden',
    width: '300px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  image: { width: '100%', height: '180px', objectFit: 'cover' },
  info: { padding: '15px' },
  pgTitle: { fontSize: '18px', color: '#2c3e50', marginBottom: '8px' },
  actions: { display: 'flex', gap: '10px', marginTop: '10px' },
  viewBtn: { flex: 1, padding: '8px', backgroundColor: '#2c3e50', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer' },
  deleteBtn: { flex: 1, padding: '8px', backgroundColor: '#e74c3c', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer' },
  msg: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#7f8c8d' }
}

export default OwnerDashboard