import { useRef } from "react";
import {
  startLesson,
  updateLessonProgress,
  completeLesson,
} from "../../services/api";

function VideoPlayer({ lesson }) {
  const lastUpdateRef = useRef(0);

  if (!lesson) {
    return (
      <div className="video-placeholder">
        Chọn bài học
      </div>
    );
  }

  const handlePlay = async () => {
    try {
      await startLesson(
        lesson.id || lesson._id,
        lesson.courseId
      );
    } catch (err) {
      console.error(
        "Start lesson error:",
        err
      );
    }
  };

  const handleTimeUpdate = async (
    currentTime
  ) => {
    currentTime = Math.floor(currentTime);

    if (
      currentTime - lastUpdateRef.current <
      30
    ) {
      return;
    }

    lastUpdateRef.current =
      currentTime;

    try {
      await updateLessonProgress(
        lesson.id || lesson._id,
        currentTime
      );
    } catch (err) {
      console.error(
        "Update progress error:",
        err
      );
    }
  };

  const handleEnded = async () => {
    try {
      await completeLesson(
        lesson.id || lesson._id
      );

      alert(
        "🎉 Bạn đã hoàn thành bài học!"
      );
    } catch (err) {
      console.error(
        "Complete lesson error:",
        err
      );
    }
  };

  const isYoutube =
    lesson.videoUrl?.includes(
      "youtube.com"
    ) ||
    lesson.videoUrl?.includes(
      "youtu.be"
    );

  return (
    <div className="video-player">
      {lesson.videoUrl ? (
        isYoutube ? (
          <iframe
            width="100%"
            height="500"
            src={lesson.videoUrl}
            title={lesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handlePlay}
          />
        ) : (
          <video
            controls
            width="100%"
            onPlay={handlePlay}
            onTimeUpdate={(e) =>
              handleTimeUpdate(
                e.target.currentTime
              )
            }
            onEnded={handleEnded}
          >
            <source
              src={lesson.videoUrl}
              type="video/mp4"
            />

            Trình duyệt của bạn không hỗ trợ
            video.
          </video>
        )
      ) : (
        <div className="video-placeholder">
          Không có video
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;