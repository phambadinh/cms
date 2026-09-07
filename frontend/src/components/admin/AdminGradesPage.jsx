import AdminCrudPage from "./AdminCrudPage";
import {
  createGrade,
  getAllCourses,
  getAllUsers,
  getGradesByCourse,
  updateGrade,
} from "../../services/api";
import { BarChart3, Plus, RefreshCw } from "lucide-react";
import "../../styles/dashboard.css";

const gradeFields = [
  { name: "userId", label: "User ID", type: "text", placeholder: "Nhập ID học viên" },
  { name: "courseId", label: "Course ID", type: "text", placeholder: "Nhập ID khóa học" },
  { name: "score", label: "Score", type: "number", placeholder: "Nhập điểm 0-100" },
];

const gradeColumns = [
  { key: "studentName", label: "Student" },
  { key: "courseName", label: "Course" },
  { key: "score", label: "Score" },
  { key: "grade", label: "Grade" },
];

const initialValues = {
  userId: "",
  courseId: "",
  score: 0,
};

const fetchAdminGrades = async () => {
  const [usersRes, coursesRes] = await Promise.all([getAllUsers(), getAllCourses()]);

  const users = usersRes.data || [];
  const courses = coursesRes.data || [];
  const userMap = Object.fromEntries(
    users.map((user) => [user.id, user.name || user.username || user.email || "Unknown user"])
  );
  const courseMap = Object.fromEntries(
    courses.map((course) => [course.id, course.name || course.code || "Unknown course"])
  );

  const records = await Promise.all(
    courses.map(async (course) => {
      try {
        const response = await getGradesByCourse(course.id);
        return (response.data || []).map((grade) => ({
          ...grade,
          studentName: userMap[grade.userId] || grade.userId || "Unknown user",
          courseName: courseMap[grade.courseId] || grade.courseId || course.name || "Unknown course",
        }));
      } catch (error) {
        console.error(`Không tải được điểm của khóa ${course.id}:`, error);
        return [];
      }
    })
  );

  return { data: records.flat().sort((a, b) => (b.evaluatedAt || "").localeCompare(a.evaluatedAt || "")) };
};

const mapToForm = (item) => ({
  userId: item.userId || "",
  courseId: item.courseId || "",
  score: item.score ?? 0,
});

const normalizeSubmit = (formData) => ({
  userId: String(formData.userId || "").trim(),
  courseId: String(formData.courseId || "").trim(),
  score: Number(formData.score || 0),
});

function AdminGradesPage() {
  return (
    <AdminCrudPage
      title="Điểm số"
      subtitle="Chấm điểm và theo dõi kết quả học tập của học viên."
      icon={BarChart3}
      primaryActionIcon={Plus}
      secondaryActionIcon={RefreshCw}
      entityLabel="điểm số"
      fetchItems={fetchAdminGrades}
      createItem={(payload) => createGrade(payload.userId, payload.courseId, payload.score)}
      updateItem={(gradeId, payload) => updateGrade(gradeId, payload.score)}
      deleteItem={async () => {}} 
      fields={gradeFields}
      columns={gradeColumns}
      initialValues={initialValues}
      mapToForm={mapToForm}
      normalizeSubmit={normalizeSubmit}
    />
  );
}

export default AdminGradesPage;
