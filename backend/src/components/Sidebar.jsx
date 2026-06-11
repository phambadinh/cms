function Sidebar() {
  return (
    <aside style={{
      width: '240px',
      minHeight: 'calc(100vh - 64px)',
      padding: '24px',
      background: '#eaf2fb',
      borderRight: '1px solid #d7e3f4'
    }}>
      <div style={{ fontWeight: 700, color: '#0f4c81', marginBottom: '20px' }}>Menu</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px', color: '#1f2937' }}>
        <li>Dashboard</li>
        <li>Courses</li>
        <li>Students</li>
        <li>Teachers</li>
        <li>Grades</li>
      </ul>
    </aside>
  )
}

export default Sidebar