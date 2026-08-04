// src/utils/mentorFormatters.js

export function formatCourseType(courseType) {
  return courseType === "FREE" ? "Miễn phí" : "Trả phí";
}

export function formatEnrollmentStatus(status) {
  switch (status) {
    case "COMPLETED":
      return "Hoàn thành";
    case "ACTIVE":
      return "Đang học";
    case "DROPPED":
      return "Đã rời";
    default:
      return "Đang học";
  }
}

export function formatDuration(seconds) {
  const value = Number(seconds || 0);
  if (!value) return "0 phút";
  const minutes = Math.max(Math.round(value / 60), 1);
  return `${minutes} phút`;
}

export function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

export function average(numbers) {
  if (!numbers.length) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

export function studentLabel(entity) {
  return entity?.studentName || entity?.username || entity?.userId || "Không rõ";
}