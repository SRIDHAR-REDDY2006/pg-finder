import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'

const PGDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [pg, setPg] = useState(null)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  useEffect(() => {
    const fetchPG = async () => {
      const { data } = await API.get(`/pg/${id}`)
      setPg(data)
    }
    const fetchReviews = async () => {
      const { data } = await API.get(`/reviews/${id}`)
      setReviews(data)
    }
    fetchPG()
    fetchReviews()
  }, [id])

  const submitReview = async () => {
    try {
      await API.post(`/reviews/${id}`, { rating, comment })
      const { data } = await API.get(`/reviews/${id}`)
      setReviews(data)
      setComment('')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review')
    }
  }

  if (!pg) return <p style={{ textAlign: 'center', padding: '50px' }}>Loading...</p>

  return (
    <div style={styles.container}>
      <div style={styles.imageBox}>
        {pg.images.length > 0 ? (
          pg.images.map((img, i) => (
            <img key={i} src={img} alt='pg' style={styles.image} />
          ))
        ) : (
          <img src='https://via.placeholder.com/800x400?text=No+Image' alt='pg' style={styles.image} />
        )}
      </div>

      <div style={styles.details}>
        <h1 style={styles.title}>{pg.title}</h1>
        <p style={styles.info}>📍 {pg.address}, {pg.city}</p>
        <p style={styles.info}>💰 ₹{pg.price}/month</p>
        <p style={styles.info}>👤 For: {pg.gender}</p>
        <p style={styles.info}>📞 Contact: {pg.phone}</p>
        <p style={styles.info}>🏠 Owner: {pg.owner?.name} ({pg.owner?.email})</p>
        {pg.description && <p style={styles.desc}>{pg.description}</p>}
        {pg.amenities.length > 0 && (
          <div style={styles.amenities}>
            <h3>Amenities:</h3>
            <div style={styles.tags}>
              {pg.amenities.map((a, i) => <span key={i} style={styles.tag}>{a}</span>)}
            </div>
          </div>
        )}

        <a href={`https://wa.me/91${pg.phone}`} target='_blank' rel='noreferrer' style={styles.whatsapp}>
          💬 Contact on WhatsApp
        </a>
      </div>

      <div style={styles.reviewSection}>
        <h2>Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((r, i) => (
          <div key={i} style={styles.review}>
            <strong>{r.student?.name}</strong> — ⭐ {r.rating}/5
            <p>{r.comment}</p>
          </div>
        ))}

        {user && user.role === 'student' && (
          <div style={styles.reviewForm}>
            <h3>Add Your Review</h3>
            <select style={styles.input} value={rating}
              onChange={(e) => setRating(Number(e.target.value))}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star</option>)}
            </select>
            <textarea style={styles.textarea} placeholder='Write your review...'
              value={comment} onChange={(e) => setComment(e.target.value)} />
            <button style={styles.btn} onClick={submitReview}>Submit Review</button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '900px', margin: '30px auto', padding: '0 20px' },
  imageBox: { display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px' },
  image: { width: '100%', maxWidth: '500px', borderRadius: '10px', objectFit: 'cover' },
  details: { backgroundColor: 'white', padding: '25px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' },
  title: { fontSize: '28px', color: '#2c3e50', marginBottom: '15px' },
  info: { fontSize: '16px', margin: '8px 0', color: '#555' },
  desc: { marginTop: '15px', color: '#666', lineHeight: '1.6' },
  amenities: { marginTop: '15px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tag: { backgroundColor: '#ecf0f1', padding: '5px 12px', borderRadius: '20px', fontSize: '13px' },
  whatsapp: { display: 'inline-block', marginTop: '20px', padding: '12px 25px',
    backgroundColor: '#25d366', color: 'white', borderRadius: '8px',
    textDecoration: 'none', fontWeight: 'bold' },
  reviewSection: { backgroundColor: 'white', padding: '25px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  review: { borderBottom: '1px solid #eee', padding: '10px 0' },
  reviewForm: { marginTop: '20px' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '14px', height: '100px', boxSizing: 'border-box' },
  btn: { padding: '10px 25px', backgroundColor: '#2c3e50', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer' }
}

export default PGDetail