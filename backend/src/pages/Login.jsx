function Login() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f7fbff' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '32px', background: '#fff', border: '1px solid #d7e3f4', borderRadius: '16px', boxShadow: '0 10px 30px rgba(15,76,129,0.08)' }}>
        <h2 style={{ marginTop: 0, color: '#0f4c81' }}>Sign in</h2>
        <p style={{ color: '#4b5563' }}>Access your CMS dashboard.</p>
        <form style={{ display: 'grid', gap: '14px' }}>
          <input placeholder="Username" style={inputStyle} />
          <input placeholder="Password" type="password" style={inputStyle} />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
      </div>
    </div>
  )
}

const inputStyle = {
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #cfe0f2',
  outline: 'none'
}

const buttonStyle = {
  padding: '12px 14px',
  border: 'none',
  borderRadius: '10px',
  background: '#0f4c81',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer'
}

export default Login