function Footer() {
  const footerStyle = {
    background: 'linear-gradient(90deg, #0f4c81, #2563eb)',
    color: '#fff',
    padding: '32px 24px 16px',
    marginTop: 'auto',
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '24px',
    textAlign: 'left',
  }

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '12px',
  }

  const linkStyle = {
    color: '#e5e7eb',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
  }

  const bottomStyle = {
    maxWidth: '1200px',
    margin: '24px auto 0',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.2)',
    textAlign: 'center',
    fontSize: '14px',
    color: '#dbeafe',
  }

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div>
          <div style={titleStyle}>About</div>
          <a href="/about" style={linkStyle}>Giới thiệu</a>
          <a href="/team" style={linkStyle}>Đội ngũ</a>
          <a href="/blog" style={linkStyle}>Tin tức</a>
        </div>

        <div>
          <div style={titleStyle}>Contact</div>
          <a href="mailto:support@cms.com" style={linkStyle}>support@cms.com</a>
          <a href="tel:+84876578996" style={linkStyle}>+84 876 578 996</a>
          <a href="/contact" style={linkStyle}>Liên hệ</a>
        </div>

        <div>
          <div style={titleStyle}>Terms</div>
          <a href="/terms" style={linkStyle}>Điều khoản sử dụng</a>
          <a href="/privacy" style={linkStyle}>Chính sách bảo mật</a>
          <a href="/cookies" style={linkStyle}>Cookie Policy</a>
        </div>

        <div>
          <div style={titleStyle}>Vị trí</div>
          <p style={{ margin: 0, marginBottom: '8px', fontSize: '14px', color: '#e5e7eb' }}>
            70 To Ky, Ho Chi Minh City, Vietnam
          </p>
          <a
            href="https://www.google.com/maps/place/70+T%C3%B4+K%C3%BD,+Trung+M%E1%BB%B9+T%C3%A2y,+H%E1%BB%93+Ch%C3%AD+Minh,+Vi%E1%BB%87t+Nam"
            target="_blank"
            rel="noreferrer"
            style={linkStyle}
          >
            Xem bản đồ
          </a>
        </div>
      </div>

      <div style={bottomStyle}>
        © Bản quyền thuộc CMS - 2026
      </div>
    </footer>
  )
}

export default Footer