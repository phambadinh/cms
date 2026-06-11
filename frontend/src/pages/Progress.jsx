function Progress() {
  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ color: '#0f4c81' }}>Progress</h2>
      <div style={card}>Learning progress will appear here.</div>
    </div>
  )
}

const card = {
  marginTop: '16px',
  padding: '20px',
  background: '#fff',
  border: '1px solid #d7e3f4',
  borderRadius: '16px'
}

export default Progress