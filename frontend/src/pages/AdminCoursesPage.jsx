import AdminCrudPage from "../components/admin/AdminCrudPage";
import { createCourse, deleteCourse, getAllCourses, publishCourse, unpublishCourse, updateCourse } from "../services/api";

const courseFields = [
  { name: "code", label: "Code", type: "text" },
  { name: "name", label: "Name", type: "text" },
  { name: "description", label: "Description", type: "textarea", rows: 4 },
  {
    name: "courseType",
    label: "Type",
    type: "select",
    options: [
      { value: "FREE", label: "FREE" },
      { value: "PREMIUM", label: "PREMIUM" },
    ],
  },
  { name: "price", label: "Price", type: "number" },
  { name: "category", label: "Category", type: "text" },
  { name: "thumbnail", label: "Thumbnail", type: "text" },
  { name: "level", label: "Level", type: "text" },
];

const columns = [
  { key: "code", label: "Code" },
  { key: "name", label: "Name" },
  { key: "courseType", label: "Type" },
  { key: "viewCount", label: "Views" },
  { key: "enrollmentCount", label: "Enrollments" },
  { key: "published", label: "Status", render: (item) => (item.published ? "Published" : "Draft") },
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
      title="Courses"
      subtitle="Live CRUD cho khóa học, có publish/unpublish và xóa thật."
      entityLabel="Course"
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
          {item.published ? "Unpublish" : "Publish"}
        </button>
      )}
    />
  );
}

export default AdminCoursesPage;