// src/components/learning/LessonSidebar.jsx

import {
  PlayCircle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

function LessonSidebar({
  lessons = [],
  currentLesson,
  onSelectLesson,
}) {
  return (
    <aside className="lesson-sidebar">

      <div className="lesson-sidebar-header">

        <h3>Nội dung khóa học</h3>

        <span>
          {lessons.length} bài học
        </span>

      </div>

      <div className="lesson-sidebar-body">

        {lessons.length === 0 ? (
          <div className="lesson-empty">
            Chưa có bài học.
          </div>
        ) : (
          lessons.map((lesson, index) => {
            const lessonId =
              lesson.id || lesson._id;

            const currentId =
              currentLesson?.id ||
              currentLesson?._id;

            const active =
              lessonId === currentId;

            return (
              <div
                key={lessonId}
                className={`lesson-item ${
                  active ? "active" : ""
                }`}
                onClick={() =>
                  onSelectLesson(
                    lesson,
                    index
                  )
                }
              >
                <div className="lesson-item-icon">

                  {active ? (
                    <CheckCircle2
                      size={22}
                    />
                  ) : (
                    <PlayCircle
                      size={22}
                    />
                  )}

                </div>

                <div className="lesson-item-content">

                  <h4>

                    {index + 1}.{" "}
                    {lesson.title}

                  </h4>

                  <div className="lesson-item-meta">

                    <span>

                      <Clock3
                        size={14}
                      />

                      {lesson.duration ||
                        "--"} phút

                    </span>

                  </div>

                </div>

              </div>
            );
          })
        )}

      </div>

    </aside>
  );
}

export default LessonSidebar;