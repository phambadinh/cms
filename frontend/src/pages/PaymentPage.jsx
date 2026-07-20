import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { completeCoursePayment } from "../services/api";
import { useEffect } from "react";
import "../styles/payment.css";

function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [refId, setRefId] = useState("");

  const courseId = searchParams.get("courseId");
  const paymentMethod = searchParams.get("paymentMethod");
  const amount = searchParams.get("amount");
  const queryStatus = searchParams.get("status");
  const transactionId = searchParams.get("transactionId");

  const PHONE_NUMBER = "0376362152";

  const handleConfirmPayment = async () => {
    if (!courseId) {
      setStatus("error");
      setMessage("Thiếu thông tin khóa học để tiếp tục thanh toán.");
      return;
    }

    // For MOMO/VNPAY require a reference/transaction id before confirming
    if ((paymentMethod === "MOMO" || paymentMethod === "VNPAY") && !refId && !transactionId) {
      setStatus("error");
      setMessage("Vui lòng nhập mã giao dịch / tham chiếu sau khi chuyển khoản.");
      return;
    }

    setLoading(true);
    try {
      const tx = transactionId || refId || null;

      const res = await completeCoursePayment(courseId, { transactionId: tx, sessionId: searchParams.get('sessionId'), paymentMethod });

      if (res.data?.verified) {
        setStatus("success");
        setMessage("Thanh toán thành công. Đang chuyển tới khóa học...");
        setTimeout(() => navigate(`/learning/${courseId}`), 1200);
      } else {
        setStatus("pending");
        setMessage(res.data?.message || "Giao dịch đang chờ xác minh. Vui lòng thử lại sau.");
      }
    } catch (err) {
      setStatus("error");
      const errorMessage = err.response?.data?.message || "Thanh toán không thành công. Vui lòng thử lại.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // If the payment gateway redirects back with a success status, auto-confirm.
  useEffect(() => {
    if (queryStatus === "success" && courseId) {
      setMessage("Xác nhận thanh toán... Vui lòng chờ.");
      handleConfirmPayment();
    } else if (queryStatus === "cancel") {
      setStatus("error");
      setMessage("Thanh toán bị hủy. Bạn có thể thử lại hoặc quay lại khóa học.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryStatus, courseId]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">CMS</h1>
        <h2 className="auth-title">Thanh toán khóa học</h2>

        {courseId ? (
          <>
            <div className="payment-summary">
              <p>
                <strong>Khóa học:</strong> {courseId}
              </p>
              <p>
                <strong>Phương thức:</strong> {paymentMethod || "Không xác định"}
              </p>
              <p>
                <strong>Số tiền:</strong> {amount ? `${amount} đ` : "Không xác định"}
              </p>
            </div>

            {/* Nếu là Momo hoặc VNPAY hiển thị thông tin chuyển khoản / QR */}
            {(paymentMethod === "MOMO" || paymentMethod === "VNPAY") && (
              <div className="payment-instructions">
                <h3>Hướng dẫn chuyển khoản {paymentMethod}</h3>

                <p>
                  <strong>Số điện thoại nhận:</strong> {PHONE_NUMBER}
                </p>

                <p>
                  <strong>Nội dung chuyển khoản:</strong> GHI_DANH {courseId}
                </p>

                <p>
                  <strong>Số tiền:</strong> {amount ? `${amount} đ` : "Vui lòng nhập số tiền"}
                </p>

                <div className="payment-qr">
                  <p>Quét mã QR để thanh toán:</p>
                  <img
                    alt="QR code"
                    src={`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(
                      `${paymentMethod}:${PHONE_NUMBER};amount=${amount || ""};note=GHI_DANH%20${courseId}`
                    )}`}
                  />
                </div>
                <p className="small">
                  Sau khi chuyển khoản, vui lòng nhập mã giao dịch/ghi chú vào ô bên dưới
                  (hoặc nếu cổng thanh toán trả về `transactionId` tự động thì bỏ qua).
                </p>

                <div style={{ marginTop: 12 }}>
                  <label>
                    Mã giao dịch / Tham chiếu:
                    <input
                      type="text"
                      value={refId}
                      onChange={(e) => setRefId(e.target.value)}
                      placeholder="Nhập mã giao dịch (vd: MOMO12345)"
                      style={{ display: 'block', width: '100%', padding: 8, marginTop: 6 }}
                    />
                  </label>
                </div>
              </div>
            )}

            <button
              className="auth-button"
              onClick={handleConfirmPayment}
              disabled={loading || ((paymentMethod === "MOMO" || paymentMethod === "VNPAY") && !refId && !transactionId)}
            >
              {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </button>

            {message && (
              <p className={status === "error" ? "auth-error" : "auth-success"}>
                {message}
              </p>
            )}
          </>
        ) : (
          <p className="auth-error">Thiếu thông tin khóa học để tiếp tục thanh toán.</p>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
