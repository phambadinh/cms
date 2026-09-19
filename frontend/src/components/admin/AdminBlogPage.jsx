import AdminCrudPage from "./AdminCrudPage";
import {
  createBlogPost,
  deleteBlogPost,
  getAllBlogPosts,
  publishBlogPost,
  unpublishBlogPost,
  updateBlogPost,
} from "../../services/blogApi";

const fields = [
  { name: "title", label: "Tiêu đề", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "date", label: "Ngày", type: "date" },
  { name: "tag", label: "Chủ đề", type: "text" },
  { name: "excerpt", label: "Tóm tắt", type: "textarea", rows: 3 },
  { name: "content", label: "Nội dung", type: "textarea", rows: 7 },
  { name: "coverImage", label: "Ảnh bìa", type: "text" },
  { name: "featured", label: "Bài nổi bật", type: "checkbox" },
  { name: "published", label: "Đã đăng", type: "checkbox" },
];

const initialValues = {
  title: "",
  slug: "",
  date: "",
  tag: "",
  excerpt: "",
  content: "",
  coverImage: "",
  featured: false,
  published: false,
};

function AdminBlogPage() {
  return (
    <AdminCrudPage
      title="Quản lý blog"
      subtitle="Tạo, chỉnh sửa và đăng bài viết từ dữ liệu backend."
      entityLabel="bài viết"
      fetchItems={getAllBlogPosts}
      createItem={createBlogPost}
      updateItem={updateBlogPost}
      deleteItem={deleteBlogPost}
      fields={fields}
      columns={[
        { key: "title", label: "Tiêu đề" },
        { key: "tag", label: "Chủ đề" },
        { key: "authorName", label: "Tác giả" },
        { key: "published", label: "Trạng thái", render: (item) => item.published ? "Đã đăng" : "Nháp" },
      ]}
      initialValues={initialValues}
      mapToForm={(item) => ({ ...initialValues, ...item })}
      normalizeSubmit={(formData) => ({ ...formData, featured: Boolean(formData.featured), published: Boolean(formData.published) })}
      renderRowActions={(item, reload) => (
        <button
          type="button"
          className="admin-row-button secondary"
          title={item.published ? "Hủy đăng" : "Đăng bài"}
          onClick={async () => {
            if (item.published) await unpublishBlogPost(item.id);
            else await publishBlogPost(item.id);
            await reload();
          }}
        >
          {item.published ? "Hủy đăng" : "Đăng"}
        </button>
      )}
    />
  );
}

export default AdminBlogPage;