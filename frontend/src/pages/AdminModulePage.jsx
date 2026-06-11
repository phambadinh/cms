function AdminModulePage({ title, subtitle, entityLabel, columns = [] }) {
  const defaultColumns = columns.length > 0 ? columns : ["ID", "Name", "Status", "Actions"];

  return (
    <div className="layout-main admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-module-title">{title}</h1>
          <p className="admin-module-subtitle">{subtitle}</p>
        </div>
        <div className="admin-module-actions">
          <button className="admin-module-button primary">+ Create {entityLabel || title}</button>
          <button className="admin-module-button">Refresh</button>
        </div>
      </div>

      <div className="admin-module-card">
        <div className="admin-module-toolbar">
          <span>Search / Filter / Sort</span>
          <span>CRUD module for {entityLabel || title}</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {defaultColumns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={defaultColumns.length} style={{ textAlign: "center", padding: "28px 12px" }}>
                  CRUD data will be wired here for {entityLabel || title}.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminModulePage;