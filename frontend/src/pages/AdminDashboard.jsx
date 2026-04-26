import { useState, useEffect } from 'react'
import API from '../utils/api'

const AdminDashboard = () => {
  const [pgs, setPgs] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('pgs')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [pgsRes, usersRes] = await Promise.all([
        API.get('/admin/pgs'),
        API.get('/admin/users')
      ])
      setPgs(pgsRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprovePG = async (id) => {
    try {
      await API.put(`/admin/pgs/${id}/approve`)
      setPgs(pgs.map(pg => pg._id === id ? { ...pg, status: 'approved' } : pg))
    } catch (err) {
      alert('Failed to approve PG')
    }
  }

  const handleRejectPG = async (id) => {
    try {
      await API.put(`/admin/pgs/${id}/reject`)
      setPgs(pgs.map(pg => pg._id === id ? { ...pg, status: 'rejected' } : pg))
    } catch (err) {
      alert('Failed to reject PG')
    }
  }

  const handleDeletePG = async (id) => {
    if (!window.confirm('Delete this PG?')) return
    try {
      await API.delete(`/admin/pgs/${id}`)
      setPgs(pgs.filter(pg => pg._id !== id))
    } catch (err) {
      alert('Failed to delete PG')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await API.delete(`/admin/users/${id}`)
      setUsers(users.filter(u => u._id !== id))
    } catch (err) {
      alert('Failed to delete user')
    }
  }

  const pendingPGs = pgs.filter(pg => pg.status === 'pending')
  const approvedPGs = pgs.filter(pg => pg.status === 'approved')
  const rejectedPGs = pgs.filter(pg => pg.status === 'rejected')

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3>{pgs.length}</h3>
          <p>Total PGs</p>
        </div>
        <div style={{ ...styles.statCard, backgroundColor: '#f39c12' }}>
          <h3>{pendingPGs.length}</h3>
          <p>Pending</p>
        </div>
        <div style={{ ...styles.statCard, backgroundColor: '#27ae60' }}>
          <h3>{approvedPGs.length}</h3>
          <p>Approved</p>
        </div>
        <div style={{ ...styles.statCard, backgroundColor: '#e74c3c' }}>
          <h3>{rejectedPGs.length}</h3>
          <p>Rejected</p>
        </div>
        <div style={{ ...styles.statCard, backgroundColor: '#8e44ad' }}>
          <h3>{users.length}</h3>
          <p>Total Users</p>
        </div>
      </div>

      <div style={styles.tabs}>
        <button style={tab === 'pgs' ? styles.activeTab : styles.tab}
          onClick={() => setTab('pgs')}>All PGs</button>
        <button style={tab === 'users' ? styles.activeTab : styles.tab}
          onClick={() => setTab('users')}>All Users</button>
      </div>

      {loading ? <p style={styles.msg}>Loading...</p> : (
        <>
          {tab === 'pgs' && (
            <div style={styles.tableBox}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>City</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Owner</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pgs.map(pg => (
                    <tr key={pg._id} style={styles.tr}>
                      <td style={styles.td}>{pg.title}</td>
                      <td style={styles.td}>{pg.city}</td>
                      <td style={styles.td}>₹{pg.price}</td>
                      <td style={styles.td}>{pg.owner?.name}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: pg.status === 'approved' ? '#27ae60' :
                            pg.status === 'rejected' ? '#e74c3c' : '#f39c12'
                        }}>
                          {pg.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          {pg.status !== 'approved' && (
                            <button style={styles.approveBtn}
                              onClick={() => handleApprovePG(pg._id)}>Approve</button>
                          )}
                          {pg.status !== 'rejected' && (
                            <button style={styles.rejectBtn}
                              onClick={() => handleRejectPG(pg._id)}>Reject</button>
                          )}
                          <button style={styles.deleteBtn}
                            onClick={() => handleDeletePG(pg._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'users' && (
            <div style={styles.tableBox}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={styles.tr}>
                      <td style={styles.td}>{u.name}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: u.role === 'admin' ? '#8e44ad' :
                            u.role === 'owner' ? '#2c3e50' : '#27ae60'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={styles.td}>{u.phone}</td>
                      <td style={styles.td}>
                        {u.role !== 'admin' && (
                          <button style={styles.deleteBtn}
                            onClick={() => handleDeleteUser(u._id)}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '30px', backgroundColor: '#f5f5f5', minHeight: '90vh' },
  title: { fontSize: '28px', color: '#2c3e50', marginBottom: '20px' },
  stats: { display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' },
  statCard: { backgroundColor: '#2c3e50', color: 'white', padding: '20px 30px',
    borderRadius: '10px', textAlign: 'center', minWidth: '120px' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '20px' },
  tab: { padding: '10px 25px', backgroundColor: '#ecf0f1', border: 'none',
    borderRadius: '5px', cursor: 'pointer', fontSize: '15px' },
  activeTab: { padding: '10px 25px', backgroundColor: '#2c3e50', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '15px' },
  tableBox: { backgroundColor: 'white', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#2c3e50', color: 'white' },
  th: { padding: '12px 15px', textAlign: 'left' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 15px', color: '#555' },
  badge: { color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' },
  actions: { display: 'flex', gap: '8px' },
  approveBtn: { padding: '6px 12px', backgroundColor: '#27ae60', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer' },
  rejectBtn: { padding: '6px 12px', backgroundColor: '#f39c12', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer' },
  msg: { textAlign: 'center', padding: '50px', color: '#7f8c8d' }
}

export default AdminDashboard