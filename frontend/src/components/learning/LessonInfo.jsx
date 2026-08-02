// src/components/learning/LessonInfo.jsx

import {
  BookOpen,
  Clock3,
  FileText,
  Video,
  CheckCircle2,
} from "lucide-react";

function LessonInfo({ lesson }) {
  if (!lesson) return null;

  return (
    <div className="lesson-info">

      <div className="lesson-info-header">

        <div>
          <h2>{lesson.title}</h2>

          <p className="lesson-description">
            {lesson.description ||
              "Bài học này chưa có mô tả."}
          </p>
        </div>

        <span className="lesson-status">
          Đang học
        </span>

      </div>

      <div className="lesson-meta">

        <div className="lesson-meta-item">
          <Video size={18} />
          <span>Video</span>
        </div>

        <div className="lesson-meta-item">
          <Clock3 size={18} />
          <span>
            {lesson.duration || "--"} phút
          </span>
        </div>

        <div className="lesson-meta-item">
          <BookOpen size={18} />
          <span>
            {lesson.lessonType || "Bài học"}
          </span>
        </div>

      </div>

      <div className="lesson-section">

        <h3>

          <FileText size={20} />

          Nội dung bài học

        </h3>

        <div className="lesson-content-box">

          {lesson.content ? (
            <div
              dangerouslySetInnerHTML={{
                __html: lesson.content,
              }}
            />
          ) : (
            <p>
              Hiện chưa có nội dung cho bài học này.
            </p>
          )}

        </div>

      </div>

      <div className="lesson-section">

        <h3>

          <CheckCircle2 size={20} />

          Tài liệu học

        </h3>

        {lesson.documentUrl ? (
          <a
            href={lesson.documentUrl}
            target="_blank"
            rel="noreferrer"
            className="lesson-document-btn"
          >
            Mở tài liệu
          </a>
        ) : (
          <p>Chưa có tài liệu đính kèm.</p>
        )}

      </div>

    </div>
  );
}

export default LessonInfo;