import { useState, useEffect } from 'react'
import API from '../utils/api'
import PGCard from '../components/PGCard'

const Home = () => {
  const [pgs, setPgs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ city: '', gender: '', minPrice: '', maxPrice: '' })

  const fetchPGs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.city) params.append('city', filters.city)
      if (filters.gender) params.append('gender', filters.gender)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      const { data } = await API.get(`/pg?${params.toString()}`)
      setPgs(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPGs() }, [])

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Perfect PG 🏠</h1>
        <p style={styles.heroSub}>Browse verified PGs and hostels near your college</p>
      </div>

      <div style={styles.filters}>
        <input style={styles.input} placeholder='Search by city...'
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
        <select style={styles.input} value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
          <option value=''>All Genders</option>
          <option value='boys'>Boys</option>
          <option value='girls'>Girls</option>
          <option value='mixed'>Mixed</option>
        </select>
        <input style={styles.input} placeholder='Min Price'
          value={filters.minPrice} type='number'
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        <input style={styles.input} placeholder='Max Price'
          value={filters.maxPrice} type='number'
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        <button style={styles.btn} onClick={fetchPGs}>Search</button>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading PGs...</p>
      ) : pgs.length === 0 ? (
        <p style={styles.loading}>No PGs found. Try different filters!</p>
      ) : (
        <div style={styles.grid}>
          {pgs.map(pg => <PGCard key={pg._id} pg={pg} />)}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { minHeight: '90vh', backgroundColor: '#f5f5f5' },
  hero: { backgroundColor: '#2c3e50', color: 'white', padding: '50px 30px', textAlign: 'center' },
  heroTitle: { fontSize: '36px', margin: '0 0 10px' },
  heroSub: { fontSize: '18px', color: '#bdc3c7' },
  filters: { display: 'flex', gap: '10px', padding: '20px 30px',
    backgroundColor: 'white', flexWrap: 'wrap', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd',
    fontSize: '14px', flex: '1', minWidth: '150px' },
  btn: { padding: '10px 25px', backgroundColor: '#2c3e50', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '30px', justifyContent: 'center' },
  loading: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#7f8c8d' }
}

export default Home