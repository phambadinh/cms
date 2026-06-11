function Navbar() {
  return (
    <header style={{
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: '#0f4c81',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <div style={{ fontSize: '20px', fontWeight: 700 }}>CMS Coursera Style</div>
      <nav style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
        <span>Dashboard</span>
        <span>Courses</span>
        <span>Students</span>
      </nav>
    </header>
  )
}

export default Navbar