import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Quiz from "./Quiz";

function LearningQuizPage() {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();

  const title = useMemo(() => "Đánh giá bài học", []);

  return (
    <div className="layout">
      <div className="layout-body">
        <main className="layout-main" style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <button
              type="button"
              className="course-detail-btn-primary"
              onClick={() => navigate(`/learning/${courseId}`)}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <ArrowLeft size={16} />
              Quay lại kênh học
            </button>
            <h2 style={{ margin: 0 }}>{title}</h2>
          </div>

          <Quiz lessonId={lessonId} />
        </main>
      </div>
    </div>
  );
}

export default LearningQuizPage;