import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm JWT token vào mỗi request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor xử lý response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_user_info');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH SERVICES ============

/**
 * Đăng ký tài khoản mới
 */
export const authRegister = (userData) => {
  return apiClient.post('/auth/register', userData);
};

/**
 * Đăng nhập
 */
export const authLogin = (username, password) => {
  return apiClient.post('/auth/login', { username, password });
};

/**
 * Đăng nhập với email
 */
export const authLoginEmail = (email, password) => {
  return apiClient.post('/auth/login-email', { email, password });
};

/**
 * Lưu token và user info vào localStorage
 */
export const saveAuthData = (token, userInfo) => {
  localStorage.setItem('cms_token', token);
  localStorage.setItem('cms_user_info', JSON.stringify(userInfo));
};

/**
 * Lấy token từ localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem('cms_token');
};

/**
 * Lấy thông tin user từ localStorage
 */
export const getAuthUser = () => {
  const userInfo = localStorage.getItem('cms_user_info');
  if (!userInfo) {
    return null;
  }

  const parsedUser = JSON.parse(userInfo);
  return {
    ...parsedUser,
    id: parsedUser.id || parsedUser.userId || null,
    userId: parsedUser.userId || parsedUser.id || null,
  };
};

/**
 * Đăng xuất
 */
export const authLogout = () => {
  localStorage.removeItem('cms_token');
  localStorage.removeItem('cms_user_info');
};

// ============ USER SERVICES ============

/**
 * Lấy profile người dùng hiện tại
 */
export const getUserProfile = () => {
  return apiClient.get('/users/profile');
};

/**
 * Cập nhật profile người dùng
 */
export const updateUserProfile = (profileData) => {
  return apiClient.put('/users/profile', profileData);
};

/**
 * Lấy danh sách người dùng theo role
 */
export const getUsersByRole = (role) => {
  return apiClient.get(`/users/role/${role}`);
};

/**
 * Lấy tất cả người dùng (ADMIN only)
 */
export const getAllUsers = () => {
  return apiClient.get('/users/admin/all');
};

/**
 * Tạo người dùng (ADMIN only)
 */
export const createUser = (userData) => {
  return apiClient.post('/users/admin', userData);
};

/**
 * Cập nhật người dùng (ADMIN only)
 */
export const updateUser = (userId, userData) => {
  return apiClient.put(`/users/admin/${userId}`, userData);
};

/**
 * Xóa người dùng (ADMIN only)
 */
export const deleteUser = (userId) => {
  return apiClient.delete(`/users/admin/${userId}`);
};

/**
 * Phân quyền người dùng (ADMIN only)
 */
export const assignUserRole = (userId, role) => {
  return apiClient.post(`/users/${userId}/assign-role`, { role });
};

/**
 * Kích hoạt người dùng (ADMIN only)
 */
export const activateUser = (userId) => {
  return apiClient.post(`/users/${userId}/activate`);
};

/**
 * Vô hiệu hóa người dùng (ADMIN only)
 */
export const deactivateUser = (userId) => {
  return apiClient.post(`/users/${userId}/deactivate`);
};

// ============ COURSE SERVICES ============

/**
 * Lấy tất cả khóa học đã công bố (PUBLIC)
 */
export const getPublicCourses = () => {
  return apiClient.get('/courses/public');
};

/**
 * Lấy khóa học miễn phí (PUBLIC)
 */
export const getFreeCourses = () => {
  return apiClient.get('/courses/public/free');
};

/**
 * Lấy khóa học trả phí (PUBLIC)
 */
export const getPremiumCourses = () => {
  return apiClient.get('/courses/public/premium');
};

/**
 * Lấy khóa học theo danh mục (PUBLIC)
 */
export const getCoursesByCategory = (category) => {
  return apiClient.get(`/courses/public/category/${category}`);
};

/**
 * Lấy chi tiết khóa học (PUBLIC)
 */
export const getCourseById = (courseId) => {
  return apiClient.get(`/courses/${courseId}`);
};

/**
 * Lấy tất cả khóa học (ADMIN only)
 */
export const getAllCourses = () => {
  return apiClient.get('/courses/admin/all');
};

/**
 * Tạo khóa học mới (MENTOR/ADMIN)
 */
export const createCourse = (courseData) => {
  return apiClient.post('/courses', courseData);
};

/**
 * Cập nhật khóa học (MENTOR/ADMIN)
 */
export const updateCourse = (courseId, courseData) => {
  return apiClient.put(`/courses/${courseId}`, courseData);
};

/**
 * Công bố khóa học (MENTOR/ADMIN)
 */
export const publishCourse = (courseId) => {
  return apiClient.post(`/courses/${courseId}/publish`);
};

/**
 * Hủy công bố khóa học (MENTOR/ADMIN)
 */
export const unpublishCourse = (courseId) => {
  return apiClient.post(`/courses/${courseId}/unpublish`);
};

/**
 * Xóa khóa học (MENTOR/ADMIN)
 */
export const deleteCourse = (courseId) => {
  return apiClient.delete(`/courses/${courseId}`);
};

/**
 * Lấy khóa học do người dùng tạo (MENTOR/ADMIN)
 */
export const getMyCreatedCourses = () => {
  return apiClient.get('/courses/my-courses');
};

// ============ LESSON SERVICES ============

/**
 * Lấy danh sách bài giảng của khóa học (PUBLIC)
 */
export const getLessonsByCourse = (courseId) => {
  return apiClient.get(`/lessons/course/${courseId}`);
};

/**
 * Lấy chi tiết bài giảng
 */
export const getLessonById = (lessonId) => {
  return apiClient.get(`/lessons/${lessonId}`);
};

/**
 * Tạo bài giảng (MENTOR/ADMIN)
 */
export const createLesson = (courseId, lessonData) => {
  return apiClient.post(`/lessons/course/${courseId}`, lessonData);
};

/**
 * Cập nhật bài giảng (MENTOR/ADMIN)
 */
export const updateLesson = (lessonId, lessonData) => {
  return apiClient.put(`/lessons/${lessonId}`, lessonData);
};

/**
 * Công bố bài giảng (MENTOR/ADMIN)
 */
export const publishLesson = (lessonId) => {
  return apiClient.post(`/lessons/${lessonId}/publish`);
};

/**
 * Hủy công bố bài giảng (MENTOR/ADMIN)
 */
export const unpublishLesson = (lessonId) => {
  return apiClient.post(`/lessons/${lessonId}/unpublish`);
};

/**
 * Xóa bài giảng (MENTOR/ADMIN)
 */
export const deleteLesson = (lessonId) => {
  return apiClient.delete(`/lessons/${lessonId}`);
};

// ============ ENROLLMENT SERVICES ============

/**
 * Đăng ký khóa học (STUDENT)
 */
export const enrollCourse = (courseId) => {
  return apiClient.post('/enrollments', { courseId });
};

/**
 * Lấy chi tiết đăng ký khóa học theo courseId (STUDENT)
 */
export const getEnrollmentByCourse = (courseId) => {
  return apiClient.get(`/enrollments/course/${courseId}`);
};

/**
 * Khởi tạo thanh toán cho khóa học premium (STUDENT)
 */
export const initiateCoursePayment = ({ courseId, paymentMethod }) => {
  return apiClient.post('/payments/initiate', { courseId, paymentMethod });
};

/**
 * Lấy danh sách khóa học đã đăng ký (STUDENT)
 */
export const getMyEnrollments = () => {
  return apiClient.get('/enrollments/my-enrollments');
};

/**
 * Lấy chi tiết enrollment
 */
export const getEnrollmentById = (enrollmentId) => {
  return apiClient.get(`/enrollments/${enrollmentId}`);
};

/**
 * Lấy danh sách học viên của khóa học (MENTOR/ADMIN)
 */
export const getEnrollmentsByCourse = (courseId) => {
  return apiClient.get(`/enrollments/course/${courseId}`);
};

/**
 * Cập nhật trạng thái enrollment (MENTOR/ADMIN)
 */
export const updateEnrollmentStatus = (enrollmentId, status) => {
  return apiClient.put(`/enrollments/${enrollmentId}`, { status });
};

// ============ QUIZ SERVICES ============

/**
 * Lấy quiz của bài giảng
 */
export const getQuizByLesson = (lessonId) => {
  return apiClient.get(`/quizzes/lesson/${lessonId}`);
};

/**
 * Tạo quiz (MENTOR/ADMIN)
 */
export const createQuiz = (lessonId, quizData) => {
  return apiClient.post(`/quizzes/lesson/${lessonId}`, quizData);
};

/**
 * Cập nhật quiz (MENTOR/ADMIN)
 */
export const updateQuiz = (quizId, quizData) => {
  return apiClient.put(`/quizzes/${quizId}`, quizData);
};

/**
 * Công bố quiz (MENTOR/ADMIN)
 */
export const publishQuiz = (quizId) => {
  return apiClient.post(`/quizzes/${quizId}/publish`);
};

/**
 * Hủy công bố quiz (MENTOR/ADMIN)
 */
export const unpublishQuiz = (quizId) => {
  return apiClient.post(`/quizzes/${quizId}/unpublish`);
};

/**
 * Xóa quiz (MENTOR/ADMIN)
 */
export const deleteQuiz = (quizId) => {
  return apiClient.delete(`/quizzes/${quizId}`);
};

// ============ QUIZ ATTEMPT SERVICES ============

/**
 * Nộp bài kiểm tra (STUDENT)
 */
export const submitQuizAttempt = (attemptData) => {
  return apiClient.post(
    "/quiz-attempts/submit",
    attemptData
  );
};

/**
 * Lấy lịch sử làm bài quiz của người dùng
 */
export const getMyQuizAttempts = () => {
  return apiClient.get('/quiz-attempts/my-attempts');
};

/**
 * Lấy chi tiết nỗ lực quiz
 */
export const getQuizAttemptById = (attemptId) => {
  return apiClient.get(`/quiz-attempts/${attemptId}`);
};

/**
 * Lấy tất cả nỗ lực quiz của bài (MENTOR/ADMIN)
 */
export const getQuizAttemptsByQuiz = (quizId) => {
  return apiClient.get(`/quiz-attempts/quiz/${quizId}`);
};

// ============ LESSON PROGRESS SERVICES ============

/**
 * Lấy tiến độ bài học
 */
export const getLessonProgress = (lessonId) => {
  return apiClient.get(`/lesson-progress/${lessonId}`);
};

/**
 * Lấy tiến độ của tất cả bài học trong khóa học
 */
export const getCourseProgress = (courseId) => {
  return apiClient.get(`/lesson-progress/course/${courseId}`);
};

/**
 * Lấy tiến độ của người dùng hiện tại
 */
export const getMyProgress = () => {
  return apiClient.get('/lesson-progress/my-progress');
};

// ============ DASHBOARD SERVICES ============

export const getAdminDashboard = () => {
  return apiClient.get('/dashboard/admin');
};

export const getMentorDashboard = () => {
  return apiClient.get('/dashboard/mentor');
};

export const getStudentDashboard = () => {
  return apiClient.get('/dashboard/student');
};

// ============ GRADE SERVICES ============

/**
 * Lấy điểm của khóa học (MENTOR/ADMIN)
 */
export const getGradesByCourse = (courseId) => {
  return apiClient.get(`/grades/course/${courseId}`);
};

/**
 * Tạo điểm (MENTOR/ADMIN)
 */
export const createGrade = (gradeData) => {
  return apiClient.post('/grades', gradeData);
};

/**
 * Cập nhật điểm (MENTOR/ADMIN)
 */
export const updateGrade = (gradeId, gradeData) => {
  return apiClient.put(`/grades/${gradeId}`, gradeData);
};

/**
 * Lấy tất cả điểm của người dùng
 */
export const getMyGrades = () => {
  return apiClient.get('/grades/my-grades');
};

export const startLesson = (
  lessonId,
  courseId
) => {
  return apiClient.post(
    `/lesson-progress/${lessonId}/start?courseId=${courseId}`
  );
};

export const updateLessonProgress =
  (lessonId, watchedDuration) => {
    return apiClient.put(
      `/lesson-progress/${lessonId}/update?watchedDuration=${watchedDuration}`
    );
  };

export const completeLesson =
  (lessonId) => {
    return apiClient.post(
      `/lesson-progress/${lessonId}/complete`
    );
  };
  
export default apiClient;