import AdminCrudPage from "./AdminCrudPage";
import { createUser, deleteUser, getUsersByRole, updateUser } from "../../services/api";

const teacherFields = [
  { name: "username", label: "Tên đăng nhập", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Mật khẩu", type: "password", placeholder: "Để trống nếu không thay đổi" },
  { name: "fullName", label: "Họ và tên", type: "text" },
  { name: "active", label: "Đang hoạt động", type: "checkbox" },
  { name: "profileImage", label: "Ảnh đại diện", type: "text" },
  { name: "bio", label: "Giới thiệu", type: "textarea", rows: 3 },
];

const columns = [
  { key: "username", label: "Tên đăng nhập" },
  { key: "fullName", label: "Họ và tên" },
  { key: "email", label: "Email" },
  { key: "active", label: "Trạng thái", render: (item) => (item.active ? "Có" : "Không") },
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
      title="Mentor"
      subtitle="Quản lý tài khoản mentor."
      entityLabel="mentor"
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