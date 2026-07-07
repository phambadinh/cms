import {
  PlayCircle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

function LessonSidebar({
  lessons,
  currentLesson,
  onSelectLesson,
}) {
  return (
    <aside className="lesson-sidebar">

      <div className="sidebar-header">
        <h3>Nội dung khóa học</h3>

        <span>
          {lessons.length} bài học
        </span>
      </div>

      {lessons.length === 0 ? (
        <div className="empty-lessons">
          <div>📚</div>
          <p>Chưa có bài học</p>
        </div>
      ) : (
        <ul>
          {lessons.map(
            (lesson, index) => (
              <li
                key={
                  lesson.id ||
                  lesson._id ||
                  index
                }
                className={
                  currentLesson?.id ===
                    lesson.id ||
                  currentLesson?._id ===
                    lesson._id
                    ? "active"
                    : ""
                }
                onClick={() =>
                  onSelectLesson(
                    lesson,
                    index
                  )
                }
              >

                <div className="lesson-number">
                  {index + 1}
                </div>

                <div className="lesson-content">

                  <div className="lesson-title">
                    {lesson.title}
                  </div>

                  <div className="lesson-meta">

                    <span>
                      <PlayCircle
                        size={13}
                      />
                      Video
                    </span>

                    <span>
                      <Clock3
                        size={13}
                      />
                      10 phút
                    </span>

                  </div>

                </div>

                {currentLesson?.id ===
                  lesson.id && (
                  <CheckCircle2
                    size={18}
                    className="lesson-check"
                  />
                )}

              </li>
            )
          )}
        </ul>
      )}

    </aside>
  );
}

export default LessonSidebar;