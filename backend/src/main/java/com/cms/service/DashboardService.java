package com.cms.service;

import com.cms.dto.DashboardResponse;
import com.cms.model.Course;
import com.cms.model.CourseView;
import com.cms.model.Enrollment;
import com.cms.model.QuizAttempt;
import com.cms.model.User;
import com.cms.model.UserRole;
import com.cms.repository.CourseRepository;
import com.cms.repository.CourseViewRepository;
import com.cms.repository.EnrollmentRepository;
import com.cms.repository.LessonProgressRepository;
import com.cms.repository.QuizAttemptRepository;
import com.cms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
        private final CourseViewRepository courseViewRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final LessonProgressRepository lessonProgressRepository;

    public DashboardService(
            UserRepository userRepository,
            CourseRepository courseRepository,
                        CourseViewRepository courseViewRepository,
            EnrollmentRepository enrollmentRepository,
            QuizAttemptRepository quizAttemptRepository,
            LessonProgressRepository lessonProgressRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
                this.courseViewRepository = courseViewRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.lessonProgressRepository = lessonProgressRepository;
    }

    public DashboardResponse getAdminDashboard() {
        List<User> users = userRepository.findAll();
        List<Course> courses = courseRepository.findAll();
        List<Enrollment> enrollments = enrollmentRepository.findAll();
        List<QuizAttempt> attempts = quizAttemptRepository.findAll();
        List<CourseView> views = courseViewRepository.findAll();

        List<DashboardResponse.InsightItem> dailyViews = buildDailyCountItems(
                views.stream().map(CourseView::getViewedAt).collect(Collectors.toList()),
                7,
                "#2563eb"
        );

        List<DashboardResponse.InsightItem> enrollmentTrend = buildDailyCountItems(
                enrollments.stream().map(Enrollment::getEnrolledAt).collect(Collectors.toList()),
                7,
                "#16a34a"
        );

        List<DashboardResponse.MentorItem> mentorItems = buildMentorItems();

        return new DashboardResponse(
                "ADMIN",
                "Admin Dashboard",
                "Tổng quan hệ thống, người dùng, khóa học và hành vi học tập.",
                List.of(
                        stat("Tổng người dùng", users.size(), "Tất cả tài khoản trong hệ thống"),
                        stat("Admin", countUsers(users, UserRole.ADMIN), "Tài khoản quản trị"),
                        stat("Mentor", countUsers(users, UserRole.MENTOR), "Tài khoản giảng viên"),
                        stat("Student", countUsers(users, UserRole.STUDENT), "Tài khoản học viên"),
                        stat("Tổng khóa học", courses.size(), "Khóa học trong database"),
                        stat("Lượt xem khóa học", totalCourseViews(courses), "Tổng lượt mở trang chi tiết khóa học"),
                        stat("Lượt đăng ký", enrollments.size(), "Tất cả enrollment"),
                        stat("Lần làm quiz", attempts.size(), "Tổng lượt nộp bài"),
                        stat("Tiến độ bài học", lessonProgressRepository.findAll().size(), "Bản ghi progress"),
                        stat("Đăng ký đang hoạt động", countEnrollmentsByStatus(enrollments, "ACTIVE"), "Enrollment đang học")
                ),
                List.of(
                        chart("Users by Role", "Cơ cấu tài khoản trong hệ thống", "DONUT", List.of(
                                chartItem("Admin", countUsers(users, UserRole.ADMIN), totalUsers(users), "#2563eb"),
                                chartItem("Mentor", countUsers(users, UserRole.MENTOR), totalUsers(users), "#16a34a"),
                                chartItem("Student", countUsers(users, UserRole.STUDENT), totalUsers(users), "#f59e0b")
                        )),
                        chart("Access Trend", "Lượt truy cập khóa học theo ngày", "BAR", dailyViews),
                        chart("Enrollment Trend", "Lượt đăng ký theo ngày", "BAR", enrollmentTrend),
                        chart("Enrollment Status", "Trạng thái ghi danh", "BAR", List.of(
                                chartItem("Active", countEnrollmentsByStatus(enrollments, "ACTIVE"), totalEnrollments(enrollments), "#2563eb"),
                                chartItem("Completed", countEnrollmentsByStatus(enrollments, "COMPLETED"), totalEnrollments(enrollments), "#16a34a"),
                                chartItem("Inactive", countEnrollmentsByStatus(enrollments, "INACTIVE"), totalEnrollments(enrollments), "#f59e0b")
                        )),
                        chart("Top Courses", "Theo lượt xem khóa học", "BAR", courses.stream()
                                .sorted(Comparator.comparing((Course course) -> course.getViewCount() == null ? 0 : course.getViewCount()).reversed())
                                .limit(5)
                                .map(course -> chartItem(
                                        course.getName(),
                                        course.getViewCount() == null ? 0 : course.getViewCount(),
                                        totalCourseViews(courses),
                                        "#7c3aed"
                                ))
                                .toList())
                ),
                courses.stream()
                        .sorted(courseComparator())
                        .limit(6)
                        .map(this::toCourseItem)
                        .toList(),
                mentorItems,
                enrollments.stream()
                        .sorted(Comparator.comparing(Enrollment::getEnrolledAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                        .limit(8)
                        .map(this::toEnrollmentItem)
                        .toList()
        );
    }

    public DashboardResponse getMentorDashboard(String mentorId) {
        List<Course> courses = courseRepository.findByInstructorId(mentorId);
        Set<String> courseIds = courses.stream().map(Course::getId).collect(Collectors.toCollection(LinkedHashSet::new));
        List<Enrollment> enrollments = enrollmentRepository.findAll().stream()
                .filter(enrollment -> courseIds.contains(enrollment.getCourseId()))
                .toList();
        List<QuizAttempt> attempts = quizAttemptRepository.findAll().stream()
                .filter(attempt -> courseIds.contains(attempt.getCourseId()))
                .toList();
        List<CourseView> views = courseViewRepository.findAll().stream()
                .filter(view -> courseIds.contains(view.getCourseId()))
                .toList();

        User mentor = userRepository.findById(mentorId).orElse(null);
        String mentorTitle = dashboardTitle(mentor, "Mentor Dashboard");

        return new DashboardResponse(
                "MENTOR",
                mentorTitle,
                "Quản lý khóa học, học viên và kết quả học tập của lớp bạn.",
                List.of(
                        stat("Khóa học của tôi", courses.size(), "Tất cả khóa học bạn đang quản lý"),
                        stat("Khóa đã công bố", (int) courses.stream().filter(Course::isPublished).count(), "Khóa học đang mở"),
                        stat("Tổng lượt xem", totalCourseViews(courses), "Lượt mở chi tiết khóa học"),
                        stat("Tổng đăng ký", enrollments.size(), "Lượt ghi danh vào khóa học của bạn"),
                        stat("Học viên duy nhất", (int) enrollments.stream().map(Enrollment::getUserId).distinct().count(), "Số học viên khác nhau"),
                        stat("Lượt quiz", attempts.size(), "Số lần học viên nộp bài")
                ),
                List.of(
                        chart("My Course Views", "Lượt xem theo khóa học", "BAR", courses.stream()
                                .sorted(Comparator.comparing((Course course) -> course.getViewCount() == null ? 0 : course.getViewCount()).reversed())
                                .limit(5)
                                .map(course -> chartItem(
                                        course.getName(),
                                        course.getViewCount() == null ? 0 : course.getViewCount(),
                                        totalCourseViews(courses),
                                        "#2563eb"
                                ))
                                .toList()),
                        chart("Access Trend", "Lượt xem theo ngày", "BAR", buildDailyCountItems(
                                views.stream().map(CourseView::getViewedAt).collect(Collectors.toList()),
                                7,
                                "#2563eb"
                        )),
                        chart("Enrollment Status", "Tình trạng học viên trong lớp", "DONUT", List.of(
                                chartItem("Active", countEnrollmentsByStatus(enrollments, "ACTIVE"), totalEnrollments(enrollments), "#2563eb"),
                                chartItem("Completed", countEnrollmentsByStatus(enrollments, "COMPLETED"), totalEnrollments(enrollments), "#16a34a"),
                                chartItem("Inactive", countEnrollmentsByStatus(enrollments, "INACTIVE"), totalEnrollments(enrollments), "#f59e0b")
                        ))
                ),
                courses.stream()
                        .sorted(courseComparator())
                        .map(this::toCourseItem)
                        .toList(),
                List.of(),
                enrollments.stream()
                        .sorted(Comparator.comparing(Enrollment::getEnrolledAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                        .limit(8)
                        .map(this::toEnrollmentItem)
                        .toList()
        );
    }

    public DashboardResponse getStudentDashboard(String studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(studentId);
        List<QuizAttempt> attempts = quizAttemptRepository.findByUserId(studentId);
        long completedLessons = lessonProgressRepository.findByUserId(studentId).stream().filter(progress -> progress.isCompleted()).count();
        List<Course> enrolledCourses = enrollments.stream()
                .map(enrollment -> courseRepository.findById(enrollment.getCourseId()).orElse(null))
                .filter(course -> course != null)
                .toList();

        User student = userRepository.findById(studentId).orElse(null);
        String studentTitle = dashboardTitle(student, "Student Dashboard");

        return new DashboardResponse(
                "STUDENT",
                studentTitle,
                "Theo dõi tiến độ học, khóa đã đăng ký và kết quả quiz.",
                List.of(
                        stat("Khóa đã đăng ký", enrollments.size(), "Tổng số enrollment của bạn"),
                        stat("Đang học", countEnrollmentsByStatus(enrollments, "ACTIVE"), "Khóa học đang diễn ra"),
                        stat("Đã hoàn thành", countEnrollmentsByStatus(enrollments, "COMPLETED"), "Khóa học đã xong"),
                        stat("Bài học hoàn thành", completedLessons, "Lesson progress đã hoàn thành"),
                        stat("Lượt quiz", attempts.size(), "Tổng lượt nộp bài"),
                        stat("Tỷ lệ hoàn thành", averageProgress(enrollments), "Trung bình progress của bạn")
                ),
                List.of(
                        chart("Progress Overview", "Tỷ lệ hoàn thành theo trạng thái", "BAR", List.of(
                                chartItem("Active", countEnrollmentsByStatus(enrollments, "ACTIVE"), totalEnrollments(enrollments), "#2563eb"),
                                chartItem("Completed", countEnrollmentsByStatus(enrollments, "COMPLETED"), totalEnrollments(enrollments), "#16a34a"),
                                chartItem("Inactive", countEnrollmentsByStatus(enrollments, "INACTIVE"), totalEnrollments(enrollments), "#f59e0b")
                        )),
                        chart("Quiz Attempts", "Tổng lượt quiz đã nộp", "DONUT", List.of(
                                chartItem("Attempts", attempts.size(), Math.max(attempts.size(), 1), "#7c3aed")
                        ))
                ),
                enrolledCourses.stream()
                        .map(this::toCourseItem)
                        .toList(),
                List.of(),
                enrollments.stream()
                        .sorted(Comparator.comparing(Enrollment::getEnrolledAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                        .map(this::toEnrollmentItem)
                        .toList()
        );
    }

    private DashboardResponse.DashboardStat stat(String label, Number value, String description) {
        return new DashboardResponse.DashboardStat(label, String.valueOf(value), description);
    }

        private DashboardResponse.InsightChart chart(String title, String subtitle, String type, List<DashboardResponse.InsightItem> items) {
                return new DashboardResponse.InsightChart(title, subtitle, type, items);
        }

            private List<DashboardResponse.InsightItem> buildDailyCountItems(List<LocalDateTime> timestamps, int days, String color) {
                Map<LocalDate, Long> counts = timestamps.stream()
                        .filter(timestamp -> timestamp != null)
                        .collect(Collectors.groupingBy(LocalDateTime::toLocalDate, Collectors.counting()));

                return java.util.stream.IntStream.range(0, days)
                        .mapToObj(offset -> LocalDate.now().minusDays(days - 1L - offset))
                        .map(date -> chartItem(
                                date.getDayOfMonth() + "/" + date.getMonthValue(),
                                counts.getOrDefault(date, 0L),
                                Math.max(counts.values().stream().mapToLong(Long::longValue).sum(), 1L),
                                color
                        ))
                        .toList();
            }

            private List<DashboardResponse.MentorItem> buildMentorItems() {
                List<User> mentors = userRepository.findByRole(UserRole.MENTOR);
                return mentors.stream()
                        .map(mentor -> {
                            List<Course> mentorCourses = courseRepository.findByInstructorId(mentor.getId());
                            List<Enrollment> mentorEnrollments = enrollmentRepository.findAll().stream()
                                    .filter(enrollment -> mentorCourses.stream().anyMatch(course -> course.getId().equals(enrollment.getCourseId())))
                                    .toList();
                            int courseCount = mentorCourses.size();
                            int enrollmentCount = mentorEnrollments.size();
                            int viewCount = mentorCourses.stream().mapToInt(course -> course.getViewCount() == null ? 0 : course.getViewCount()).sum();
                            int publishedCourseCount = (int) mentorCourses.stream().filter(Course::isPublished).count();
                            return new DashboardResponse.MentorItem(
                                    mentor.getId(),
                                    mentor.getFullName() != null ? mentor.getFullName() : mentor.getUsername(),
                                    courseCount,
                                    enrollmentCount,
                                    viewCount,
                                    publishedCourseCount
                            );
                        })
                        .sorted(Comparator.comparing(DashboardService::mentorSortKey).reversed())
                        .limit(5)
                        .toList();
            }

            private static int mentorSortKey(DashboardResponse.MentorItem mentorItem) {
                return (mentorItem.getEnrollmentCount() == null ? 0 : mentorItem.getEnrollmentCount()) +
                        (mentorItem.getViewCount() == null ? 0 : mentorItem.getViewCount());
            }

        private DashboardResponse.InsightItem chartItem(String label, Number value, Number total, String color) {
                double numericValue = value == null ? 0.0 : value.doubleValue();
                double numericTotal = total == null || total.doubleValue() <= 0 ? 1.0 : total.doubleValue();
                double percentage = Math.round((numericValue / numericTotal) * 10000.0) / 100.0;
                return new DashboardResponse.InsightItem(label, numericValue, percentage, color);
        }

        private int totalUsers(List<User> users) {
                return users == null ? 0 : users.size();
        }

        private int totalEnrollments(List<Enrollment> enrollments) {
                return enrollments == null ? 0 : enrollments.size();
        }

    private int countUsers(List<User> users, UserRole role) {
        return (int) users.stream().filter(user -> user.getRole() == role).count();
    }

    private int countEnrollmentsByStatus(List<Enrollment> enrollments, String status) {
        return (int) enrollments.stream().filter(enrollment -> status.equalsIgnoreCase(enrollment.getStatus())).count();
    }

    private int totalCourseViews(List<Course> courses) {
        return courses.stream().mapToInt(course -> course.getViewCount() == null ? 0 : course.getViewCount()).sum();
    }

    private double averageProgress(List<Enrollment> enrollments) {
        if (enrollments.isEmpty()) {
            return 0.0;
        }
        double sum = enrollments.stream()
                .mapToDouble(enrollment -> enrollment.getProgressPercentage() == null ? 0.0 : enrollment.getProgressPercentage())
                .sum();
        return Math.round((sum / enrollments.size()) * 100.0) / 100.0;
    }

    private Comparator<Course> courseComparator() {
        return Comparator.comparing(
                (Course course) -> course.getEnrollmentCount() == null ? 0 : course.getEnrollmentCount()
        ).reversed();
    }

    private DashboardResponse.CourseItem toCourseItem(Course course) {
        String courseName = safeText(course.getName(), "Khóa học không tên");
        String courseType = course.getCourseType() == null ? "UNKNOWN" : safeText(course.getCourseType().name(), "UNKNOWN");
        return new DashboardResponse.CourseItem(
                course.getId(),
                courseName,
                courseType,
                course.isPublished(),
                course.getEnrollmentCount() == null ? 0 : course.getEnrollmentCount(),
                course.getViewCount() == null ? 0 : course.getViewCount()
        );
    }

    private DashboardResponse.EnrollmentItem toEnrollmentItem(Enrollment enrollment) {
        String userName = userRepository.findById(enrollment.getUserId())
                .map(User::getFullName)
                .orElseGet(() -> safeText(enrollment.getUserId(), "Unknown user"));
        String courseName = courseRepository.findById(enrollment.getCourseId())
                .map(Course::getName)
                .orElseGet(() -> safeText(enrollment.getCourseId(), "Unknown course"));
        return new DashboardResponse.EnrollmentItem(
                safeText(enrollment.getId(), "unknown-enrollment"),
                safeText(enrollment.getUserId(), "unknown-user"),
                safeText(userName, "Unknown user"),
                safeText(enrollment.getCourseId(), "unknown-course"),
                safeText(courseName, "Unknown course"),
                safeText(enrollment.getStatus(), "UNKNOWN"),
                enrollment.getProgressPercentage(),
                safeText(enrollment.getPaymentStatus(), "UNKNOWN"),
                enrollment.getEnrolledAt()
        );
    }

        private String dashboardTitle(User user, String fallback) {
                if (user == null) {
                        return fallback;
                }

                String fullName = safeText(user.getFullName(), "");
                if (!fullName.isBlank()) {
                        return fullName + " Dashboard";
                }

                String username = safeText(user.getUsername(), "");
                if (!username.isBlank()) {
                        return username + " Dashboard";
                }

                return fallback;
        }

    private String safeText(String value, String fallback) {
        return Objects.toString(value, fallback);
    }
}