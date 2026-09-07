import AdminCrudPage from "./AdminCrudPage";
import {
  createLesson,
  deleteLesson,
  getAllCourses,
  getLessonsByCourse,
  publishLesson,
  unpublishLesson,
  updateLesson,
} from "../../services/api";
import { BookOpen, Eye, EyeOff, Plus, RefreshCw } from "lucide-react";
import "../../styles/dashboard.css";

const lessonFields = [
  { name: "courseId", label: "Mã khóa học", type: "text", placeholder: "Nhập ID khóa học" },
  { name: "title", label: "Tiêu đề", type: "text", placeholder: "Nhập tiêu đề bài học" },
  { name: "description", label: "Mô tả", type: "textarea", rows: 4 },
  { name: "videoUrl", label: "Đường dẫn video", type: "text", placeholder: "https://..." },
  { name: "duration", label: "Thời lượng (giây)", type: "number" },
  { name: "orderNumber", label: "Thứ tự", type: "number" },
];

const lessonColumns = [
  { key: "title", label: "Bài học" },
  { key: "courseName", label: "Khóa học" },
  { key: "orderNumber", label: "Thứ tự" },
  { key: "duration", label: "Thời lượng" },
  {
    key: "published",
    label: "Trạng thái",
    render: (item) => (item.published ? "Đã xuất bản" : "Bản nháp"),
  },
];

const initialValues = {
  courseId: "",
  title: "",
  description: "",
  videoUrl: "",
  duration: 0,
  orderNumber: 0,
};

const fetchAdminLessons = async () => {
  const coursesResponse = await getAllCourses();
  const courses = coursesResponse.data || [];

  const lessonLists = await Promise.all(
    courses.map(async (course) => {
      try {
        const response = await getLessonsByCourse(course.id);
        return (response.data || []).map((lesson) => ({
          ...lesson,
          courseId: lesson.courseId || course.id,
          courseName: course.name || course.title || course.code || "Không tên",
        }));
      } catch (error) {
        console.error(`Không tải được bài học của khóa ${course.id}:`, error);
        return [];
      }
    })
  );

  const lessons = lessonLists.flat().sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));
  return { data: lessons };
};

const mapToForm = (item) => ({
  courseId: item.courseId || "",
  title: item.title || "",
  description: item.description || "",
  videoUrl: item.videoUrl || "",
  duration: item.duration ?? 0,
  orderNumber: item.orderNumber ?? 0,
});

const normalizeSubmit = (formData) => ({
  ...formData,
  courseId: String(formData.courseId || "").trim(),
  title: String(formData.title || "").trim(),
  description: String(formData.description || "").trim(),
  videoUrl: String(formData.videoUrl || "").trim(),
  duration: Number(formData.duration || 0),
  orderNumber: Number(formData.orderNumber || 0),
});

function AdminLessonsPage() {
  return (
    <AdminCrudPage
      title="Bài học"
      subtitle="Quản lý bài học theo từng khóa, có tạo, cập nhật, publish và xóa thật."
      icon={BookOpen}
      primaryActionIcon={Plus}
      secondaryActionIcon={RefreshCw}
      entityLabel="bài học"
      fetchItems={fetchAdminLessons}
      createItem={createLesson}
      updateItem={updateLesson}
      deleteItem={deleteLesson}
      fields={lessonFields}
      columns={lessonColumns}
      initialValues={initialValues}
      mapToForm={mapToForm}
      normalizeSubmit={normalizeSubmit}
      renderRowActions={(item, refresh) => (
        <button
          type="button"
          className="admin-row-button"
          onClick={async () => {
            if (item.published) {
              await unpublishLesson(item.id);
            } else {
              await publishLesson(item.id);
            }
            refresh();
          }}
        >
          {item.published ? (
            <>
              <EyeOff size={14} style={{ marginRight: 4 }} />
              Hủy xuất bản
            </>
          ) : (
            <>
              <Eye size={14} style={{ marginRight: 4 }} />
              Xuất bản
            </>
          )}
        </button>
      )}
    />
  );
}

export default AdminLessonsPage;
