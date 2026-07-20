// src/pages/MyLearning.jsx
import { useEffect, useState } from "react";
import {
  BookOpen,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyEnrollments } from "../services/api";

import "../styles/myLearning.css";

function MyLearning() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyEnrollments();
        setEnrollments(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalCourses = enrollments.length;

  const learningCourses = enrollments.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  const completedCourses = enrollments.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  return (
    <div className="my-learning-page">

      {/* ================= HEADER ================= */}

      <div className="learning-hero">

        <h1>My Learning</h1>

        <p>
          Continue your learning journey and
          keep building your skills.
        </p>

      </div>

      {/* ================= STATS ================= */}

      <div className="learning-stats">

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
            <Clock3 size={24} />
          </div>

          <h3>In Progress</h3>

          <div className="value">
            {learningCourses}
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <CheckCircle2 size={24} />
          </div>

          <h3>Completed</h3>

          <div className="value">
            {completedCourses}
          </div>

        </div>

      </div>

      {/* ================= EMPTY ================= */}

      {loading ? (

        <div className="empty-learning">

          <h3>Loading...</h3>

        </div>

      ) : enrollments.length === 0 ? (

        <div className="empty-learning">

          <BookOpen
            size={72}
            color="#0056D2"
          />

          <h3>
            No enrolled courses
          </h3>

          <p>
            Browse our catalog and enroll in your
            first course.
          </p>

        </div>

      ) : (

        <>

          {/* ================= TITLE ================= */}

          <div className="section-title">

            Continue Learning

          </div>

          {/* ================= GRID ================= */}

          <div className="my-courses-grid">

            {enrollments.map((item) => (

              <div
                key={item.id}
                className="my-course-card"
              >

                {/* THUMBNAIL */}

                <div className="course-banner">

                  {item.courseName
                    ?.charAt(0)
                    ?.toUpperCase() || "C"}

                </div>

                {/* BODY */}

                <div className="my-course-card-content">

                  <div
                    className={`course-status ${
                      item.status === "COMPLETED"
                        ? "completed"
                        : "active"
                    }`}
                  >
                    {item.status === "COMPLETED"
                      ? "Completed"
                      : "In Progress"}
                  </div>

                  <h3>

                    {item.courseName ||
                      "Course"}

                  </h3>

                  <div className="course-level">

                    Beginner

                  </div>

                  <p>

                    Continue learning and complete
                    this course to unlock your
                    certificate.

                  </p>

                  {/* Progress */}

                  <div className="course-progress">

                    <div className="course-progress-label">

                      <span>
                        Progress
                      </span>

                      <span>
                        {item.progressPercentage || 0}%
                      </span>

                    </div>

                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.progressPercentage || 0}%`,
                        }}
                      />

                    </div>

                  </div>

                  <button
                    className="continue-btn"
                    onClick={() =>
                      navigate(
                        `/learning/${item.courseId}`
                      )
                    }
                  >

                    Continue Learning

                    <ArrowRight
                      size={18}
                    />

                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* ================= STUDY TIP ================= */}

          <div className="study-tip">

            <div className="study-tip-icon">

              <Lightbulb size={24} />

            </div>

            <div>

              <h3>

                Learning Tip

              </h3>

              <p>

                Spending just 30 minutes a day
                consistently is more effective
                than studying for several hours
                only once a week.

              </p>

            </div>

          </div>

        </>

      )}

    </div>
  );
}

export default MyLearning;
