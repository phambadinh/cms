import { PlayCircle } from "lucide-react";

function LessonSidebar({
  lessons,
  currentLesson,
  onSelectLesson,
}) {
  return (
    <aside className="lesson-sidebar">
      <h3>Nội dung khóa học</h3>

      <ul>
        {lessons.map(
          (lesson, index) => (
            <li
              key={lesson.id}
              className={
                currentLesson?.id ===
                lesson.id
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
              <PlayCircle size={18} />

              <span>
                {lesson.title}
              </span>
            </li>
          )
        )}
      </ul>
    </aside>
  );
}

export default LessonSidebar;