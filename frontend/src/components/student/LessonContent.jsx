// src/components/student/LessonContent.jsx

function LessonContent({ lesson }) {
  if (!lesson) {
    return (
      <div className="lesson-content">
        <h2>Chưa chọn bài học</h2>
      </div>
    );
  }

  return (
    <div className="lesson-content">

      <h2 className="lesson-title">
        {lesson.title}
      </h2>

      <div className="lesson-description">
        <p>
          {lesson.description ||
            "Chưa có nội dung mô tả"}
        </p>
      </div>

    </div>
  );
}

export default LessonContent;