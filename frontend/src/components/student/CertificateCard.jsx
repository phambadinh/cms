// src/components/student/CertificateCard.jsx

import { Award } from "lucide-react";

function CertificateCard({
  courseName,
  completed,
}) {
  if (!completed) return null;

  return (
    <div className="certificate-card">
      <Award size={40} />

      <h3>Chứng chỉ hoàn thành</h3>

      <p>{courseName}</p>

      <button>
        Tải chứng chỉ
      </button>
    </div>
  );
}

export default CertificateCard;