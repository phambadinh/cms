import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, ClipboardCheck, LoaderCircle } from "lucide-react";
import { getCourseById, getLessonsByCourse, getEnrollmentByCourse } from "../../services/api";

import VideoPlayer from "../learning/VideoPlayer";
import LessonSidebar from "../learning/LessonSidebar";
import ProgressTracker from "../learning/ProgressTracker";
import LessonInfo from "../learning/LessonInfo";

import "../../styles/learningCourse.css";

function LearningCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [courseRes, enrollmentRes] = await Promise.all([getCourseById(courseId), getEnrollmentByCourse(courseId)]);

        const courseData = courseRes.data;
        const enrollmentData = enrollmentRes.data || null;

        setCourse(courseData);
        setEnrollment(enrollmentData);

        const isFree = courseData.courseType === "FREE";

        if (!enrollmentData) {
          navigate(`/courses/${courseId}`);
          return;
        }

        if (!isFree && enrollmentData.paymentStatus !== "COMPLETED") {
          navigate(`/courses/${courseId}`);
          return;
        }

        const lessonRes = await getLessonsByCourse(courseId);
        const lessonData = lessonRes.data || [];

        setLessons(lessonData);

        if (lessonData.length > 0) {
          setCurrentLesson(lessonData[0]);
          setProgress((1 / lessonData.length) * 100);
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải khóa học.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, navigate]);

  const handleLessonChange = (lesson, index) => {
    setCurrentLesson(lesson);
    setProgress(((index + 1) / lessons.length) * 100);
  };

  if (loading) {
    return (
      <div className="empty-learning-state">
        <div className="empty-learning-icon">
          <LoaderCircle className="learning-spin" size={60} />
        </div>
        <h2>Đang tải khóa học...</h2>
        <p>Vui lòng chờ trong giây lát.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-learning-state">
        <div className="empty-learning-icon">
          <BookOpen size={60} />
        </div>
        <h2>Có lỗi xảy ra</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="learning-page">
      <div className="learning-header">
        <div>
          <h1>{course?.title || "Learning"}</h1>
          <p>Continue your learning journey</p>
        </div>

        <button
          className="learning-quiz-btn"
          onClick={() =>
            currentLesson && navigate(`/learning/${courseId}/quiz/${currentLesson.id || currentLesson._id}`)
          }
        >
          <ClipboardCheck size={18} />
          Quiz
        </button>
      </div>

      <div className="learning-layout">
        <div className="learning-main">
          <VideoPlayer lesson={currentLesson} />
          <LessonInfo lesson={currentLesson} />
          <ProgressTracker current={progress} totalLessons={lessons.length} />
        </div>

        <LessonSidebar lessons={lessons} currentLesson={currentLesson} onSelectLesson={handleLessonChange} />
      </div>
    </div>
  );
}

export default LearningCourse;