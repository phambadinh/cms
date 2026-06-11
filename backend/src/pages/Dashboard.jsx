function Dashboard() {
  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ color: '#0f4c81' }}>Dashboard</h2>
      <div style={card}>Welcome to CMS dashboard.</div>
    </div>
  )
}

const card = {
  marginTop: '16px',
  padding: '20px',
  background: '#fff',
  border: '1px solid #d7e3f4',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(15,76,129,0.06)'
}

export default Dashboard