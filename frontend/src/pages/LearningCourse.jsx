import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLessonsByCourse } from "../services/api";

import VideoPlayer from "../components/learning/VideoPlayer";
import LessonSidebar from "../components/learning/LessonSidebar";
import ProgressTracker from "../components/learning/ProgressTracker";
import LessonContent from "../components/student/LessonContent";

import "../styles/learningCourse.css";

function LearningCourse() {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await getLessonsByCourse(courseId);

        const data = res.data || [];

        setLessons(data);

        if (data.length > 0) {
          setCurrentLesson(data[0]);

          setProgress(
            (1 / data.length) * 100
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  const handleLessonChange = (
    lesson,
    index
  ) => {
    setCurrentLesson(lesson);

    const percent =
      ((index + 1) / lessons.length) * 100;

    setProgress(percent);
  };

  if (loading) {
    return (
      <div className="empty-learning-state">
        <div className="empty-learning-icon">
          ⏳
        </div>

        <h2>Đang tải khóa học...</h2>

        <p>
          Vui lòng chờ trong giây lát.
        </p>
      </div>
    );
  }

  return (
    <div className="learning-layout">

      <div className="learning-main">

        <ProgressTracker
          current={progress}
        />

        <div className="learning-header">
          <h2>Khóa học đang học</h2>

          <span>
            {lessons.length} bài học
          </span>
        </div>

        {currentLesson && (
          <div className="current-lesson-banner">
            🎥 Đang học:
            <strong>
              {" "}
              {currentLesson.title}
            </strong>
          </div>
        )}

        {currentLesson ? (
          <>
            <VideoPlayer
              lesson={currentLesson}
            />

            <LessonContent
              lesson={currentLesson}
            />
          </>
        ) : (
          <div className="empty-learning-state">

            <div className="empty-learning-icon">
              📚
            </div>

            <h2>
              Chưa có bài học
            </h2>

            <p>
              Khóa học này hiện chưa có
              nội dung hoặc dữ liệu bài học
              chưa được tải.
            </p>

          </div>
        )}

      </div>

      <LessonSidebar
        lessons={lessons}
        currentLesson={currentLesson}
        onSelectLesson={
          handleLessonChange
        }
      />

    </div>
  );
}

export default LearningCourse;