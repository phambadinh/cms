import { apiClient } from "./api";

export const getFeaturedBlogPosts = () => {
  return apiClient.get("/blog-posts/public/featured");
};

export const getBlogPostBySlug = (slug) => {
  return apiClient.get(`/blog-posts/public/slug/${slug}`);
};

export const getPublicBlogPostsPage = (page = 0, size = 6) => {
  return apiClient.get("/blog-posts/public", {
    params: { page, size },
  });
};

export const getAllBlogPosts = () => apiClient.get("/blog-posts/admin/all");
export const createBlogPost = (postData) => apiClient.post("/blog-posts", postData);
export const updateBlogPost = (postId, postData) => apiClient.put(`/blog-posts/${postId}`, postData);
export const deleteBlogPost = (postId) => apiClient.delete(`/blog-posts/${postId}`);
export const publishBlogPost = (postId) => apiClient.post(`/blog-posts/${postId}/publish`);
export const unpublishBlogPost = (postId) => apiClient.post(`/blog-posts/${postId}/unpublish`);