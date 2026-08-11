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