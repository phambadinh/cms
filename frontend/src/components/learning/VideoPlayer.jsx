function VideoPlayer({ lesson }) {

  if (!lesson) {
    return (
      <div className="video-placeholder">
        Chọn bài học
      </div>
    );
  }

  return (
    <div className="video-player">

      {lesson.videoUrl ? (
        <video controls>
          <source
            src={lesson.videoUrl}
            type="video/mp4"
          />
        </video>
      ) : (
        <div className="video-placeholder">
          Không có video
        </div>
      )}

    </div>
  );
}

export default VideoPlayer;