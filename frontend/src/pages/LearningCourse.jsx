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

          // Tiến độ bài đầu tiên
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

  // ===== ĐỔI BÀI HỌC =====
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
    return <p>Đang tải bài học...</p>;
  }

  return (
    <div className="learning-layout">

      <div className="learning-main">

        <ProgressTracker
          current={progress}
        />

        <VideoPlayer
          lesson={currentLesson}
        />

        <LessonContent
        lesson={currentLesson}
        />
        

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