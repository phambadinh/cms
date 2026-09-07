import AdminCrudPage from "./AdminCrudPage";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  publishCourse,
  unpublishCourse,
  updateCourse,
} from "../../services/api";
import {
  BookOpen,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import "../../styles/dashboard.css";

const courseFields = [
  { name: "code", label: "Mã khóa học", type: "text" },
  { name: "name", label: "Tên khóa học", type: "text" },
  { name: "description", label: "Mô tả", type: "textarea", rows: 4 },
  {
    name: "courseType",
    label: "Loại khóa học",
    type: "select",
    options: [
      { value: "FREE", label: "FREE" },
      { value: "PREMIUM", label: "PREMIUM" },
    ],
  },
  { name: "price", label: "Giá", type: "number" },
  { name: "category", label: "Danh mục", type: "text" },
  { name: "thumbnail", label: "Ảnh đại diện", type: "text" },
  { name: "level", label: "Cấp độ", type: "text" },
];

const columns = [
  { key: "code", label: "Mã" },
  { key: "name", label: "Tên khóa học" },
  { key: "courseType", label: "Loại" },
  { key: "viewCount", label: "Lượt xem" },
  { key: "enrollmentCount", label: "Lượt đăng ký" },
  {
    key: "published",
    label: "Trạng thái",
    render: (item) => (item.published ? "Đã xuất bản" : "Bản nháp"),
  },
];

const initialValues = {
  code: "",
  name: "",
  description: "",
  courseType: "FREE",
  price: 0,
  category: "",
  thumbnail: "",
  level: "BEGINNER",
};

function AdminCoursesPage() {
  return (
    <AdminCrudPage
      title="Khóa học"
      subtitle="Quản lý khóa học, xuất bản và xóa dữ liệu."
      icon={BookOpen}
      primaryActionIcon={Plus}
      secondaryActionIcon={RefreshCw}
      entityLabel="khóa học"
      fetchItems={getAllCourses}
      createItem={createCourse}
      updateItem={updateCourse}
      deleteItem={deleteCourse}
      fields={courseFields}
      columns={columns}
      initialValues={initialValues}
      mapToForm={(item) => ({
        code: item.code || "",
        name: item.name || "",
        description: item.description || "",
        courseType: item.courseType || "FREE",
        price: item.price ?? 0,
        category: item.category || "",
        thumbnail: item.thumbnail || "",
        level: item.level || "BEGINNER",
      })}
      normalizeSubmit={(formData) => ({
        ...formData,
        price: formData.courseType === "FREE" ? 0 : Number(formData.price || 0),
      })}
      renderRowActions={(item, refresh) => (
        <button
          type="button"
          className="admin-row-button"
          onClick={async () => {
            if (item.published) {
              await unpublishCourse(item.id);
            } else {
              await publishCourse(item.id);
            }
            refresh();
          }}
        >
          {item.published ? (
            <>
              <EyeOff size={14} style={{ marginRight: 4 }} />
              Unpublish
            </>
          ) : (
            <>
              <Eye size={14} style={{ marginRight: 4 }} />
              Publish
            </>
          )}
        </button>
      )}
    />
  );
}

export default AdminCoursesPage;