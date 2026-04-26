import { useNavigate } from 'react-router-dom'

const PGCard = ({ pg }) => {
  const navigate = useNavigate()

  return (
    <div style={styles.card}>
      <img
        src={pg.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={pg.title}
        style={styles.image}
      />
      <div style={styles.info}>
        <h3 style={styles.title}>{pg.title}</h3>
        <p style={styles.city}>📍 {pg.city}</p>
        <p style={styles.price}>💰 ₹{pg.price}/month</p>
        <p style={styles.gender}>👤 {pg.gender}</p>
        <button onClick={() => navigate(`/pg/${pg._id}`)} style={styles.btn}>
          View Details
        </button>
      </div>
    </div>
  )
}

const styles = {
  card: { border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden',
    width: '300px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', backgroundColor: 'white' },
  image: { width: '100%', height: '200px', objectFit: 'cover' },
  info: { padding: '15px' },
  title: { margin: '0 0 8px', fontSize: '18px', color: '#2c3e50' },
  city: { margin: '4px 0', color: '#7f8c8d' },
  price: { margin: '4px 0', color: '#27ae60', fontWeight: 'bold' },
  gender: { margin: '4px 0', color: '#7f8c8d' },
  btn: { marginTop: '10px', width: '100%', padding: '10px', backgroundColor: '#2c3e50',
    color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '15px' }
}

export default PGCard