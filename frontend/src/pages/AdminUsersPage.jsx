import AdminCrudPage from "../components/admin/AdminCrudPage";
import { createUser, deleteUser, getAllUsers, updateUser } from "../services/api";

const roleOptions = [
  { value: "ADMIN", label: "ADMIN" },
  { value: "MENTOR", label: "MENTOR" },
  { value: "STUDENT", label: "STUDENT" },
];

const userFields = [
  { name: "username", label: "Username", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password", placeholder: "Leave blank to keep current" },
  { name: "fullName", label: "Full name", type: "text" },
  { name: "role", label: "Role", type: "select", options: roleOptions },
  { name: "active", label: "Active", type: "checkbox" },
  { name: "profileImage", label: "Profile image", type: "text" },
  { name: "bio", label: "Bio", type: "textarea", rows: 3 },
];

const columns = [
  { key: "username", label: "Username" },
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "active", label: "Active", render: (item) => (item.active ? "Yes" : "No") },
];

const initialValues = {
  username: "",
  email: "",
  password: "",
  fullName: "",
  role: "STUDENT",
  active: true,
  profileImage: "",
  bio: "",
};

function AdminUsersPage() {
  return (
    <AdminCrudPage
      title="Users"
      subtitle="Chức năng chỉnh sửa users."
      entityLabel="User"
      fetchItems={getAllUsers}
      createItem={createUser}
      updateItem={updateUser}
      deleteItem={deleteUser}
      fields={userFields}
      columns={columns}
      initialValues={initialValues}
      mapToForm={(item) => ({
        username: item.username || "",
        email: item.email || "",
        password: "",
        fullName: item.fullName || "",
        role: item.role || "STUDENT",
        active: Boolean(item.active),
        profileImage: item.profileImage || "",
        bio: item.bio || "",
      })}
      normalizeSubmit={(formData) => ({
        ...formData,
        password: formData.password || undefined,
        role: formData.role || "STUDENT",
        active: Boolean(formData.active),
      })}
    />
  );
}

export default AdminUsersPage;