function Header() {
  return (
    <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.78)', borderBottom: '1px solid var(--cms-border)', backdropFilter: 'blur(8px)' }}>
      <h1 style={{ margin: 0, color: 'var(--cms-blue-900)', fontSize: '24px' }}>Course Management System</h1>
      <p style={{ margin: '6px 0 0', color: 'var(--cms-muted)' }}>Coursera-inspired blue theme</p>
    </div>
  )
}

export default Header