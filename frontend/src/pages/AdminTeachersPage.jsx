import AdminCrudPage from "../components/admin/AdminCrudPage";
import { createUser, deleteUser, getUsersByRole, updateUser } from "../services/api";

const teacherFields = [
  { name: "username", label: "Username", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password", placeholder: "Leave blank to keep current" },
  { name: "fullName", label: "Full name", type: "text" },
  { name: "active", label: "Active", type: "checkbox" },
  { name: "profileImage", label: "Profile image", type: "text" },
  { name: "bio", label: "Bio", type: "textarea", rows: 3 },
];

const columns = [
  { key: "username", label: "Username" },
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "active", label: "Active", render: (item) => (item.active ? "Yes" : "No") },
];

const initialValues = {
  username: "",
  email: "",
  password: "",
  fullName: "",
  active: true,
  profileImage: "",
  bio: "",
  role: "MENTOR",
};

function AdminTeachersPage() {
  return (
    <AdminCrudPage
      title="Teachers"
      subtitle="Chức năng."
      entityLabel="Teacher"
      fetchItems={() => getUsersByRole("MENTOR")}
      createItem={createUser}
      updateItem={updateUser}
      deleteItem={deleteUser}
      fields={teacherFields}
      columns={columns}
      initialValues={initialValues}
      mapToForm={(item) => ({
        username: item.username || "",
        email: item.email || "",
        password: "",
        fullName: item.fullName || "",
        active: Boolean(item.active),
        profileImage: item.profileImage || "",
        bio: item.bio || "",
        role: "MENTOR",
      })}
      normalizeSubmit={(formData) => ({
        ...formData,
        password: formData.password || undefined,
        role: "MENTOR",
        active: Boolean(formData.active),
      })}
    />
  );
}

export default AdminTeachersPage;