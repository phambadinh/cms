import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  RefreshCw,
  Save,
  RotateCcw,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

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
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialValues);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const isEditing = editingId !== null;

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetchItems();
      setItems(res.data || []);
    } catch {
      setError(`Không thể tải ${entityLabel}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = normalizeSubmit
        ? normalizeSubmit(formData, isEditing)
        : formData;

      if (isEditing) {
        await updateItem(editingId, payload);
      } else {
        await createItem(payload);
      }

      await loadItems();
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1 className="admin-module-title">{title}</h1>
          <p className="admin-module-subtitle">{subtitle}</p>
        </div>

        <div className="admin-module-actions">
          <button
            type="button"
            className="admin-module-button"
            onClick={loadItems}
          >
            <RefreshCw size={18} style={{ marginRight: 6 }} />
            Refresh
          </button>

          <button
            type="button"
            className="admin-module-button primary"
            onClick={resetForm}
          >
            <Plus size={18} style={{ marginRight: 6 }} />
            New {entityLabel}
          </button>
        </div>
      </div>

      {error && <div className="dash-error">{error}</div>}

      <div className="admin-crud-grid">
        <form className="admin-crud-form admin-module-card" onSubmit={handleSubmit}>
          <h3>{isEditing ? `Edit ${entityLabel}` : `Create ${entityLabel}`}</h3>

          <div className="admin-form-grid">
            {fields.map((field) => (
              <label key={field.name} className="admin-field">
                <span>{field.label}</span>

                {field.type === "textarea" ? (
                  <textarea
                    rows={field.rows || 3}
                    value={formData[field.name] ?? ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.name] ?? ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  >
                    {(field.options || []).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(formData[field.name])}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={formData[field.name] ?? ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-module-button primary"
              disabled={submitting}
            >
              <Save size={18} style={{ marginRight: 6 }} />
              {isEditing ? "Update" : "Create"}
            </button>

            <button
              type="button"
              className="admin-module-button"
              onClick={resetForm}
            >
              <RotateCcw size={18} style={{ marginRight: 6 }} />
              Reset
            </button>
          </div>
        </form>

        <div className="admin-module-card">
          <div className="admin-module-toolbar">
            <div className="table-search">
              <Search size={18} style={{ marginRight: 6 }} />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <span>{filteredItems.length} records</span>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + 1}>Loading...</td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1}>No records found.</td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      {columns.map((c) => (
                        <td key={c.key}>
                          {c.render ? c.render(item) : item[c.key]}
                        </td>
                      ))}

                      <td>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="admin-row-button"
                            onClick={() => {
                              setEditingId(item.id);
                              setFormData(mapToForm ? mapToForm(item) : item);
                            }}
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            className="admin-row-button danger"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 size={14} />
                          </button>

                          {renderRowActions && renderRowActions(item, loadItems)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCrudPage;