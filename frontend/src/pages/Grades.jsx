// src/pages/Grades.jsx

import { useEffect, useState } from "react";
import {
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyGrades } from "../services/api";

import "../styles/grades.css";

function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyGrades();
        setGrades(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalCourses = grades.length;

  const passedCourses = grades.filter(
    (item) => (item.finalGrade || 0) >= 5
  ).length;

  const averageGrade =
    grades.length > 0
      ? (
          grades.reduce(
            (sum, item) => sum + (item.finalGrade || 0),
            0
          ) / grades.length
        ).toFixed(1)
      : 0;

  return (
    <div className="grades-page">
      {/* ================= HEADER ================= */}

      <div className="grades-hero">
        <h1>My Grades</h1>

        <p>
          Track your academic performance and
          review your course results.
        </p>
      </div>

      {/* ================= STATS ================= */}

      <div className="grades-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>

          <h3>Total Courses</h3>

          <div className="value">
            {totalCourses}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={24} />
          </div>

          <h3>Passed</h3>

          <div className="value">
            {passedCourses}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>

          <h3>Average Grade</h3>

          <div className="value">
            {averageGrade}
          </div>
        </div>
      </div>

      {/* ================= EMPTY ================= */}

      {loading ? (
        <div className="empty-grades">
          <h3>Loading...</h3>
        </div>
      ) : grades.length === 0 ? (
        <div className="empty-grades">
          <BookOpen
            size={72}
            color="#0056D2"
          />

          <h3>
            No grades available
          </h3>

          <p>
            Your grades will appear here after
            completing course assessments.
          </p>
        </div>
      ) : (
        <>
          {/* ================= TITLE ================= */}

          <div className="section-title">
            Course Results
          </div>

          {/* ================= GRID ================= */}

          <div className="grades-grid">
            {grades.map((item) => (
              <div
                key={item.id}
                className="grade-card"
              >
                {/* THUMBNAIL */}

                <div className="grade-banner">
                  {item.courseName
                    ?.charAt(0)
                    ?.toUpperCase() || "C"}
                </div>

                {/* BODY */}

                <div className="grade-card-content">
                  <div
                    className={`grade-status ${
                      (item.finalGrade || 0) >= 5
                        ? "passed"
                        : "failed"
                    }`}
                  >
                    {(item.finalGrade || 0) >= 5
                      ? "Passed"
                      : "Not Passed"}
                  </div>

                  <h3>
                    {item.courseName || "Course"}
                  </h3>

                  <div className="grade-meta">
                    Final Grade:{" "}
                    <span>
                      {item.finalGrade || 0}
                    </span>
                  </div>

                  <p>
                    Review your course performance
                    and continue improving your
                    learning outcomes.
                  </p>

                  {/* SCORE */}

                  <div className="grade-progress">
                    <div className="grade-progress-label">
                      <span>
                        Completion Score
                      </span>

                      <span>
                        {item.finalGrade || 0}/10
                      </span>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            ((item.finalGrade || 0) /
                              10) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate(
                        `/learning/${item.courseId}`
                      )
                    }
                  >
                    View Course

                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= NOTE ================= */}

          <div className="grades-tip">
            <div className="grades-tip-icon">
                <BookOpen size={28} />
            </div>

            <div>
              <h3>
                Academic Tip
              </h3>

              <p>
                Reviewing feedback regularly helps
                you improve faster than focusing
                only on final scores.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Grades;