package com.cms.config;

import com.cms.model.*;
import com.cms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

private final UserRepository userRepository;
private final CourseRepository courseRepository;
private final LessonRepository lessonRepository;
private final QuizRepository quizRepository;
private final QuestionRepository questionRepository;
private final EnrollmentRepository enrollmentRepository;
private final LessonProgressRepository lessonProgressRepository;
private final QuizAttemptRepository quizAttemptRepository;
private final CourseViewRepository courseViewRepository;
private final GradeRepository gradeRepository;

private final PasswordEncoder passwordEncoder;

private final List<User> mentors = new ArrayList<>();
private final List<User> students = new ArrayList<>();
private final List<Course> courses = new ArrayList<>();


private void seedUsers() {

    String now = LocalDateTime.now().toString();

    User admin = new User(
            null,
            "admin",
            passwordEncoder.encode("admin123"),
            "System Administrator",
            "admin@cms.com",
            UserRole.ADMIN,
            "https://i.pravatar.cc/300?img=1",
            "CMS Administrator",
            true,
            now,
            now
    );

    userRepository.save(admin);

    User mentor1 = new User(
            null,
            "mentor1",
            passwordEncoder.encode("123456"),
            "Nguyen Van Mentor",
            "mentor1@cms.com",
            UserRole.MENTOR,
            "https://i.pravatar.cc/300?img=11",
            "Java & Spring Boot Mentor",
            true,
            now,
            now
    );

    User mentor2 = new User(
            null,
            "mentor2",
            passwordEncoder.encode("123456"),
            "Tran Thi Mentor",
            "mentor2@cms.com",
            UserRole.MENTOR,
            "https://i.pravatar.cc/300?img=12",
            "Backend Development Mentor",
            true,
            now,
            now
    );

    mentors.add(userRepository.save(mentor1));
    mentors.add(userRepository.save(mentor2));

    for (int i = 1; i <= 10; i++) {

        User student = new User(
                null,
                "student" + i,
                passwordEncoder.encode("123456"),
                "Student " + i,
                "student" + i + "@cms.com",
                UserRole.STUDENT,
                "https://i.pravatar.cc/300?img=" + (20 + i),
                "Learning programming",
                true,
                now,
                now
        );

        students.add(
                userRepository.save(student)
        );
    }

    System.out.println("Users seeded successfully.");
}

private void seedCourses() {

    LocalDateTime now = LocalDateTime.now();

    courses.add(createCourse(
            "JAVA101",
            "Java Core Masterclass",
            "Complete Java programming course",
            mentors.get(0).getId(),
            CourseType.FREE,
            0.0,
            "Java",
            "Beginner"
    ));

    courses.add(createCourse(
            "SPRING101",
            "Spring Boot REST API",
            "Build production ready APIs",
            mentors.get(0).getId(),
            CourseType.PREMIUM,
            49.0,
            "Spring Boot",
            "Intermediate"
    ));

    courses.add(createCourse(
            "JS101",
            "JavaScript ES6 Complete",
            "Modern JavaScript from zero",
            mentors.get(0).getId(),
            CourseType.FREE,
            0.0,
            "JavaScript",
            "Beginner"
    ));

    courses.add(createCourse(
            "REACT101",
            "ReactJS Complete Guide",
            "Build frontend applications",
            mentors.get(0).getId(),
            CourseType.PREMIUM,
            59.0,
            "ReactJS",
            "Intermediate"
    ));

    courses.add(createCourse(
            "PY101",
            "Python Fundamentals",
            "Learn Python programming",
            mentors.get(1).getId(),
            CourseType.FREE,
            0.0,
            "Python",
            "Beginner"
    ));

    courses.add(createCourse(
            "GO101",
            "Golang Backend Development",
            "Build APIs with Go",
            mentors.get(1).getId(),
            CourseType.PREMIUM,
            69.0,
            "Golang",
            "Advanced"
    ));

    courses.add(createCourse(
            "PHP101",
            "PHP Laravel Framework",
            "Laravel from beginner to pro",
            mentors.get(1).getId(),
            CourseType.PREMIUM,
            39.0,
            "PHP",
            "Intermediate"
    ));

    courses.add(createCourse(
            "MYSQL101",
            "MySQL Database",
            "SQL and database design",
            mentors.get(1).getId(),
            CourseType.FREE,
            0.0,
            "Database",
            "Beginner"
    ));

    courses.add(createCourse(
            "MONGO101",
            "MongoDB Database",
            "NoSQL database development",
            mentors.get(1).getId(),
            CourseType.FREE,
            0.0,
            "Database",
            "Intermediate"
    ));

    courses.add(createCourse(
            "CSHARP101",
            "C# ASP.NET Core",
            "Enterprise backend development",
            mentors.get(1).getId(),
            CourseType.PREMIUM,
            79.0,
            "C#",
            "Advanced"
    ));

   List<Course> savedCourses = courseRepository.saveAll(courses);

courses.clear();
courses.addAll(savedCourses);

    System.out.println("Courses seeded successfully.");
}

private Course createCourse(
        String code,
        String name,
        String description,
        String instructorId,
        CourseType courseType,
        Double price,
        String category,
        String level
) {

    return new Course(
            null,
            code,
            name,
            description,
            instructorId,
            courseType,
            price,
            category,
            "https://picsum.photos/800/450?random=" + code,
            level,
            10,
            4.8,
            0,
            0,
            true,
            LocalDateTime.now(),
            LocalDateTime.now()
    );
}



private void seedLessonsAndQuizzes() {

List<String> youtubeVideos = List.of(
        "https://www.youtube.com/embed/grEKMHGYyns",
        "https://www.youtube.com/embed/eIrMbAQSU34",
        "https://www.youtube.com/embed/xk4_1vDrzzo",
        "https://www.youtube.com/embed/GoXwIVyNvX0",
        "https://www.youtube.com/embed/rfscVS0vtbw",
        "https://www.youtube.com/embed/8DvywoWv6fI",
        "https://www.youtube.com/embed/YS4e4q9oBaU",
        "https://www.youtube.com/embed/1Rs2ND1ryYc",
        "https://www.youtube.com/embed/zOjov-2OZ0E",
        "https://www.youtube.com/embed/Oe421EPjeBE"
);

for (Course course : courses) {

    for (int i = 1; i <= 10; i++) {

        Lesson lesson = new Lesson(
                null,
                course.getId(),
                course.getName() + " - Lesson " + i,
                "Detailed lesson content for lesson " + i,
                youtubeVideos.get((i - 1) % youtubeVideos.size()),
                600,
                i,
                true,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        lesson = lessonRepository.save(lesson);

        seedQuizForLesson(
                lesson,
                course,
                i
        );
    }
}

System.out.println("Lessons, Quizzes, Questions seeded.");


}

private void seedQuizForLesson(
Lesson lesson,
Course course,
int lessonNumber
) {


Quiz quiz = new Quiz(
        null,
        lesson.getId(),
        course.getId(),
        lesson.getTitle() + " Quiz",
        "Quiz for " + lesson.getTitle(),
        70,
        new ArrayList<>(),
        true,
        LocalDateTime.now(),
        LocalDateTime.now()
);

quiz = quizRepository.save(quiz);

List<String> questionIds = new ArrayList<>();

for (int q = 1; q <= 5; q++) {

    Question question = new Question(
            null,
            quiz.getId(),
            buildQuestionText(
                    course.getCategory(),
                    q
            ),
            List.of(
                    "Option A",
                    "Option B",
                    "Option C",
                    "Option D"
            ),
            0,
            q,
            "Correct answer is Option A",
            LocalDateTime.now()
    );

    question = questionRepository.save(question);

    questionIds.add(
            question.getId()
    );
}

quiz.setQuestionIds(questionIds);

quizRepository.save(quiz);


}

private String buildQuestionText(
String category,
int index
) {


switch (category.toLowerCase()) {

    case "java":
        return "Java Question " + index;

    case "javascript":
        return "JavaScript Question " + index;

    case "python":
        return "Python Question " + index;

    case "golang":
        return "Go Question " + index;

    case "php":
        return "PHP Question " + index;

    case "c#":
        return "C# Question " + index;

    case "database":
        return "Database Question " + index;

    default:
        return "Programming Question " + index;
}
}

private void seedStudentData() {

    List<Lesson> allLessons = lessonRepository.findAll();
    List<Quiz> allQuizzes = quizRepository.findAll();

    for (User student : students) {

        for (int i = 0; i < 3; i++) {

            Course course = courses.get(
                    (students.indexOf(student) + i)
                            % courses.size()
            );

            List<Lesson> courseLessons =
                    lessonRepository.findByCourseIdOrderByOrderNumber(
                            course.getId()
                    );

            String lastLessonId =
                    courseLessons.get(4).getId();

            Enrollment enrollment =
                    new Enrollment(
                            null,
                            student.getId(),
                            course.getId(),
                            "ACTIVE",
                            50.0,
                            lastLessonId,
                            course.getCourseType()
                                    == CourseType.FREE
                                    ? 0.0
                                    : course.getPrice(),
                            "COMPLETED",
                            LocalDateTime.now().minusDays(10),
                            null
                    );

            enrollment =
                    enrollmentRepository.save(
                            enrollment
                    );

            seedLessonProgress(
                    student,
                    course,
                    courseLessons
            );

            seedQuizAttempts(
                    student,
                    course
            );

            seedGrade(
                    student,
                    course
            );

            course.setEnrollmentCount(
                    course.getEnrollmentCount() + 1
            );
        }
    }
    List<Course> savedCourses = courseRepository.saveAll(courses);
    courses.clear();
    courses.addAll(savedCourses);

    seedCourseViews();

    System.out.println(
            "Enrollment, Progress, Grade, View seeded."
    );
}
private void seedLessonProgress(
        User student,
        Course course,
        List<Lesson> lessons
) {

    for (int i = 0; i < lessons.size(); i++) {

        Lesson lesson = lessons.get(i);

        boolean completed = i < 5;

        LessonProgress progress =
                new LessonProgress(
                        null,
                        student.getId(),
                        lesson.getId(),
                        course.getId(),
                        completed,
                        completed
                                ? 600.0
                                : 250.0,
                        LocalDateTime.now()
                                .minusDays(5),
                        completed
                                ? LocalDateTime.now()
                                : null
                );

        lessonProgressRepository.save(
                progress
        );
    }
}
private void seedQuizAttempts(
        User student,
        Course course
) {

    List<Quiz> quizzes =
            quizRepository.findByCourseId(
                    course.getId()
            );

    for (int i = 0; i < Math.min(3, quizzes.size()); i++) {

        Quiz quiz = quizzes.get(i);

        QuizAttempt attempt =
                new QuizAttempt(
                        null,
                        quiz.getId(),
                        student.getId(),
                        course.getId(),
                        4,
                        5,
                        List.of(
                                0,
                                1,
                                0,
                                2,
                                0
                        ),
                        true,
                        LocalDateTime.now(),
                        300L
                );

        quizAttemptRepository.save(
                attempt
        );
    }
}
private void seedGrade(
        User student,
        Course course
) {

    Grade grade =
            new Grade(
                    null,
                    student.getId(),
                    course.getId(),
                    85.0,
                    100.0,
                    "A",
                    LocalDateTime.now()
            );

    gradeRepository.save(
            grade
    );
}
private void seedCourseViews() {

    for (Course course : courses) {

        int viewCount = 100;

        for (int i = 0; i < viewCount; i++) {

            User student =
                    students.get(
                            i % students.size()
                    );

            CourseView view =
                    new CourseView(
                            null,
                            course.getId(),
                            student.getId(),
                            LocalDateTime.now()
                                    .minusDays(i % 30)
                    );

            courseViewRepository.save(
                    view
            );
        }

        course.setViewCount(viewCount);
    }

    List<Course> savedCourses = courseRepository.saveAll(courses);
    courses.clear();
    courses.addAll(savedCourses);
}

@Override
public void run(String... args) {

    if (userRepository.count() > 0) {
        System.out.println("Seed data already exists.");
        return;
    }

    System.out.println("Starting CMS Seed...");

    seedUsers();
    seedCourses();
    seedLessonsAndQuizzes();
    seedStudentData();

    System.out.println("Users: " + userRepository.count());
    System.out.println("Courses: " + courseRepository.count());
    System.out.println("Lessons: " + lessonRepository.count());
    System.out.println("Quizzes: " + quizRepository.count());
    System.out.println("Questions: " + questionRepository.count());
    System.out.println("Enrollments: " + enrollmentRepository.count());
    System.out.println("LessonProgress: " + lessonProgressRepository.count());
    System.out.println("QuizAttempts: " + quizAttemptRepository.count());
    System.out.println("Grades: " + gradeRepository.count());
    System.out.println("CourseViews: " + courseViewRepository.count());

    System.out.println("CMS Seed Completed.");
}
}