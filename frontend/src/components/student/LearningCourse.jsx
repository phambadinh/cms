import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, ClipboardCheck, LoaderCircle } from "lucide-react";
import { getCourseById, getLessonsByCourse, getEnrollmentByCourse } from "../../services/api";

import VideoPlayer from "../learning/VideoPlayer";
import LessonSidebar from "../learning/LessonSidebar";
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

  const completedLessons = lessons.length > 0 ? Math.round((progress / 100) * lessons.length) : 0;

  return (
      <div className="learning-layout">
        <div className="learning-main">
          <div className="learning-progress-card">
            <div className="learning-progress-card-header">
              <h3>Tiến độ học tập</h3>
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

            <div className="learning-progress-summary">
              <div>
                <p>Theo dõi quá trình hoàn thành khóa học</p>
              </div>
              <div className="progress-percent">
                {Math.round(progress)}%
              </div>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="progress-stats">
              <div className="progress-card">
                <BookOpen size={22} />
                <div>
                  <strong>{completedLessons}</strong>
                  <span>Bài đã học</span>
                </div>
              </div>

              <div className="progress-card">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="mini-trend-icon">
                  <path d="M4 14l6-6 4 4 6-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 8v6h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <strong>{Math.round(progress)}%</strong>
                  <span>Hoàn thành</span>
                </div>
              </div>

              <div className="progress-card">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="mini-trophy-icon">
                  <path d="M7 4h10v2a5 5 0 0 1-10 0V4zm0 0H5a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5h1m10-8h2a2 2 0 0 1 2 2v1a5 5 0 0 1-5 5h-1M12 14v4m-3 0h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <strong>{lessons.length}</strong>
                  <span>Tổng bài học</span>
                </div>
              </div>
            </div>
          </div>

          <VideoPlayer lesson={currentLesson} />
          <LessonInfo lesson={currentLesson} />
        </div>

        <LessonSidebar lessons={lessons} currentLesson={currentLesson} onSelectLesson={handleLessonChange} />
      </div>
  );
}

export default LearningCourse;