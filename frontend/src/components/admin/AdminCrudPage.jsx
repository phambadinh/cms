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
    <div className="admin-crud-page">
      <div className="admin-crud-header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="admin-crud-actions">
          <button onClick={loadItems}>
            <RefreshCw size={18} />
            Refresh
          </button>

          <button onClick={resetForm}>
            <Plus size={18} />
            New {entityLabel}
          </button>
        </div>
      </div>

      {error && <div className="dash-error">{error}</div>}

      <div className="admin-crud-grid">
        <form className="admin-crud-form" onSubmit={handleSubmit}>
          <h3>{isEditing ? `Edit ${entityLabel}` : `Create ${entityLabel}`}</h3>

          {fields.map((field) => (
            <label key={field.name}>
              <span>{field.label}</span>

              <input
                type={field.type || "text"}
                value={formData[field.name] ?? ""}
                onChange={(e) =>
                  handleChange(field.name, e.target.value)
                }
              />
            </label>
          ))}

          <div className="admin-form-actions">
            <button type="submit" disabled={submitting}>
              <Save size={18} />
              {isEditing ? "Update" : "Create"}
            </button>

            <button type="button" onClick={resetForm}>
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </form>

        <div className="admin-crud-table">
          <div className="table-toolbar">
            <div className="table-search">
              <Search size={18} />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <span>{filteredItems.length} records</span>
          </div>

          <table>
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
                  <td colSpan={columns.length + 1}>
                    No records found.
                  </td>
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
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setFormData(
                            mapToForm ? mapToForm(item) : item
                          );
                        }}
                        type="button"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>

                      {renderRowActions &&
                        renderRowActions(item, loadItems)}
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