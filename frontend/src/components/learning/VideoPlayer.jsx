// src/components/learning/VideoPlayer.jsx

import { PlayCircle } from "lucide-react";

function VideoPlayer({ lesson }) {
  if (!lesson) {
    return (
      <div className="video-player">
        <div className="video-placeholder">
          <PlayCircle size={70} />
          <p>Chưa có bài học để hiển thị.</p>
        </div>
      </div>
    );
  }

  const videoUrl =
    lesson.videoUrl ||
    lesson.video ||
    lesson.youtubeUrl ||
    "";

  // Chuyển link YouTube sang embed
  const getYoutubeEmbed = (url) => {
    if (!url) return "";

    if (url.includes("embed")) return url;

    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    if (url.includes("youtu.be/")) {
      return url.replace(
        "https://youtu.be/",
        "https://www.youtube.com/embed/"
      );
    }

    return url;
  };

  const isYoutube =
    videoUrl.includes("youtube.com") ||
    videoUrl.includes("youtu.be");

  return (
    <div className="video-player">

      {videoUrl ? (
        isYoutube ? (
          <iframe
            className="learning-video"
            src={getYoutubeEmbed(videoUrl)}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            className="learning-video"
            controls
            controlsList="nodownload"
          >
            <source
              src={videoUrl}
              type="video/mp4"
            />

            Trình duyệt của bạn không hỗ trợ video.
          </video>
        )
      ) : (
        <div className="video-placeholder">

          <PlayCircle size={70} />

          <h2>Chưa có video</h2>

          <p>
            Mentor chưa cập nhật video cho bài học này.
          </p>

        </div>
      )}

    </div>
  );
}

export default VideoPlayer;