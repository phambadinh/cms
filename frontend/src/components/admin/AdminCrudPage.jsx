import { useEffect, useMemo, useState } from "react";

function AdminCrudPage({
  title,
  subtitle,
  entityLabel,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  fields,
  columns,
  initialValues,
  mapToForm,
  normalizeSubmit,
  renderRowActions,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialValues);

  const isEditing = editingId !== null;
  const sortedItems = useMemo(() => items, [items]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchItems();
      setItems(response.data || []);
    } catch (err) {
      console.error(`Error loading ${entityLabel}:`, err);
      setError(`Không thể tải danh sách ${entityLabel}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      const payload = normalizeSubmit ? normalizeSubmit(formData, isEditing) : formData;

      if (isEditing) {
        await updateItem(editingId, payload);
      } else {
        await createItem(payload);
      }

      await loadItems();
      resetForm();
    } catch (err) {
      console.error(`Error saving ${entityLabel}:`, err);
      setError(err.response?.data?.message || `Không thể lưu ${entityLabel}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(mapToForm ? mapToForm(item) : { ...item });
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Xóa ${entityLabel} này?`)) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await deleteItem(item.id);
      await loadItems();
      if (editingId === item.id) {
        resetForm();
      }
    } catch (err) {
      console.error(`Error deleting ${entityLabel}:`, err);
      setError(err.response?.data?.message || `Không thể xóa ${entityLabel}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="layout-main admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-module-title">{title}</h1>
          <p className="admin-module-subtitle">{subtitle}</p>
        </div>
        <div className="admin-module-actions">
          <button className="admin-module-button" onClick={loadItems} type="button">
            Refresh
          </button>
          <button className="admin-module-button primary" onClick={resetForm} type="button">
            + New {entityLabel}
          </button>
        </div>
      </div>

      {error && <p className="dash-error">{error}</p>}

      <div className="admin-crud-grid">
        <form className="admin-module-card admin-crud-form" onSubmit={handleSubmit}>
          <div className="admin-module-toolbar">
            <span>{isEditing ? `Edit ${entityLabel}` : `Create ${entityLabel}`}</span>
            <span>{isEditing ? `Updating ${editingId}` : `New ${entityLabel}`}</span>
          </div>

          <div className="admin-form-grid">
            {fields.map((field) => (
              <label className="admin-field" key={field.name}>
                <span>{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    value={formData[field.name] ?? ""}
                    onChange={(event) => handleChange(field.name, event.target.value)}
                    rows={field.rows || 4}
                    placeholder={field.placeholder || ""}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.name] ?? ""}
                    onChange={(event) => handleChange(field.name, event.target.value)}
                  >
                    <option value="">Select...</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(formData[field.name])}
                    onChange={(event) => handleChange(field.name, event.target.checked)}
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    value={formData[field.name] ?? ""}
                    onChange={(event) => handleChange(field.name, event.target.value)}
                    placeholder={field.placeholder || ""}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="admin-form-actions">
            <button className="admin-module-button primary" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
            <button className="admin-module-button" type="button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>

        <div className="admin-module-card">
          <div className="admin-module-toolbar">
            <span>Live {entityLabel} list</span>
            <span>{sortedItems.length} records</span>
          </div>

          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key}>{column.label}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item) => (
                    <tr key={item.id}>
                      {columns.map((column) => (
                        <td key={column.key}>
                          {column.render ? column.render(item) : item[column.key] ?? "-"}
                        </td>
                      ))}
                      <td>
                        <div className="admin-row-actions">
                          <button type="button" className="admin-row-button" onClick={() => handleEdit(item)}>
                            Edit
                          </button>
                          <button type="button" className="admin-row-button danger" onClick={() => handleDelete(item)}>
                            Delete
                          </button>
                          {renderRowActions ? renderRowActions(item, loadItems) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {sortedItems.length === 0 && (
                    <tr>
                      <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: "24px" }}>
                        No {entityLabel.toLowerCase()} records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCrudPage;