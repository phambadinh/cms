import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  RefreshCw,
  Save,
  RotateCcw,
  Pencil,
  Trash2,
  Search,
  X,
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
  const [showForm, setShowForm] = useState(false);
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
    setShowForm(false);
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
            Làm mới
          </button>

          <button
            type="button"
            className="admin-module-button primary"
            onClick={() => {
              setEditingId(null);
              setFormData(initialValues);
              setShowForm(true);
            }}
          >
            <Plus size={18} style={{ marginRight: 6 }} />
            Tạo {entityLabel}
          </button>
        </div>
      </div>

      {error && <div className="dash-error">{error}</div>}

      {showForm || isEditing ? (
        <div
          className="admin-crud-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) resetForm();
          }}
        >
          <form
            className="admin-crud-modal admin-module-card"
            onSubmit={handleSubmit}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-crud-modal-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="admin-crud-modal-header">
              <h3 id="admin-crud-modal-title">
                {isEditing ? `Chỉnh sửa ${entityLabel}` : `Tạo ${entityLabel}`}
              </h3>
              <button
                type="button"
                className="admin-row-button"
                aria-label="Đóng biểu mẫu"
                title="Đóng"
                onClick={resetForm}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-form-grid">
              {fields.map((field) => (
                <label
                  key={field.name}
                  className={`admin-field admin-field-${field.type || "text"}`}
                >
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
                {isEditing ? "Cập nhật" : "Tạo"}
              </button>

              <button
                type="button"
                className="admin-module-button"
                onClick={resetForm}
              >
                <RotateCcw size={18} style={{ marginRight: 6 }} />
                Đặt lại
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="admin-module-card">
        <div className="admin-module-toolbar">
          <div className="table-search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              aria-label="Tìm kiếm bản ghi"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <span>{filteredItems.length} bản ghi</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1}>Đang tải...</td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1}>Không tìm thấy bản ghi.</td>
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
                          aria-label={`Chỉnh sửa ${entityLabel}`}
                          title="Chỉnh sửa"
                          onClick={() => {
                            setEditingId(item.id);
                            setFormData(mapToForm ? mapToForm(item) : item);
                            setShowForm(true);
                          }}
                        >
                          <Pencil size={14} aria-hidden="true" />
                          <span>Sửa</span>
                        </button>

                        <button
                          type="button"
                          className="admin-row-button danger"
                          aria-label={`Xóa ${entityLabel}`}
                          title="Xóa"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          <span>Xóa</span>
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
  );
}

export default AdminCrudPage;