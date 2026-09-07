import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  completeCoursePayment,
  getAuthUser,
  getCourseById,
  getVietQrBanks,
  initiateCoursePayment,
} from "../services/api";
import "../styles/payment.css";

function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [stepError, setStepError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [vietQrBank, setVietQrBank] = useState(null);

  const [selectedMethod, setSelectedMethod] = useState(
    searchParams.get("paymentMethod") || "BANK_TRANSFER"
  );
  const [couponCode, setCouponCode] = useState("FREE100");
  const [couponMessage, setCouponMessage] = useState("Áp dụng mã giảm giá để xem ưu đãi.");
  const [discountAmount, setDiscountAmount] = useState(0);

  const courseId = searchParams.get("courseId");
  const paymentMethodFromQuery = searchParams.get("paymentMethod");
  const amountFromQuery = Number(searchParams.get("amount") || 0);
  const queryStatus = searchParams.get("status");
  const sessionId = searchParams.get("sessionId");
  const step = searchParams.get("step") || (paymentMethodFromQuery ? "methods" : "review");

  const user = useMemo(() => getAuthUser(), []);
  const amount = course?.price ?? amountFromQuery;
  const finalAmount = Math.max((amount || 0) - discountAmount, 0);

  const orderCode = useMemo(() => {
    if (!courseId) return "ORD-UNKNOWN";
    const suffix = sessionId || paymentMethodFromQuery || "PENDING";
    return `ORD-${courseId}-${String(suffix).slice(0, 10)}`;
  }, [courseId, paymentMethodFromQuery, sessionId]);

  const hasConfirmedRef = useRef(false);

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [navigate, user]);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) {
        setPageError("Thiếu thông tin khóa học để tiếp tục thanh toán.");
        return;
      }
      setCourseLoading(true);
      setPageError("");
      try {
        const response = await getCourseById(courseId);
        setCourse(response.data);
      } catch (error) {
        setPageError("Không thể tải thông tin khóa học. Vui lòng thử lại.");
      } finally {
        setCourseLoading(false);
      }
    };
    loadCourse();
  }, [courseId]);

  useEffect(() => {
    if (paymentMethodFromQuery) setSelectedMethod(paymentMethodFromQuery);
  }, [paymentMethodFromQuery]);

  useEffect(() => {
    let active = true;
    getVietQrBanks()
      .then((banks) => {
        const bank = banks.find((item) =>
          item.code === "MB" ||
          /^(MB|MBBANK)$/i.test(String(item.shortName || "")) ||
          /MBBANK|MB BANK/i.test(String(item.name || ""))
        );
        if (active) setVietQrBank(bank || null);
      })
      .catch(() => {
        if (active) setVietQrBank(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const couponSummary = useMemo(() => {
    if (!couponCode.trim()) return "";
    return couponCode.trim().toUpperCase() === "FREE100"
      ? "Giảm 100.000 đ"
      : "Mã hợp lệ nhưng chưa có ưu đãi cấu hình sẵn.";
  }, [couponCode]);

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "FREE100") {
      setDiscountAmount(Math.min(100000, amount || 0));
      setCouponMessage("Đã áp dụng mã FREE100.");
    } else {
      setDiscountAmount(0);
      setCouponMessage("Mã giảm giá chưa hợp lệ hoặc chưa được kích hoạt.");
    }
  };

  const handleStartPayment = () => {
    if (!courseId) {
      setStepError("Thiếu thông tin khóa học để tiếp tục thanh toán.");
      return;
    }
    if (step === "review") {
      navigate(`/payment?courseId=${courseId}&step=methods`);
      return;
    }
    if (step === "methods") {
      navigate(
        `/payment?courseId=${courseId}&step=transfer&paymentMethod=${selectedMethod}&amount=${finalAmount}`
      );
    }
  };

  const handleSelectMethod = async (method) => {
    if (processing) return;
    setSelectedMethod(method);
    setStepError("");
    if (method === "BANK_TRANSFER") return;
    if (!courseId) {
      setStepError("Thiếu thông tin khóa học để tạo giao dịch.");
      return;
    }

    setProcessing(true);
    try {
      const response = await initiateCoursePayment({ courseId, paymentMethod: method });
      const paymentUrl = response.data?.paymentUrl;

      if (
        paymentUrl &&
        /^https?:\/\//i.test(paymentUrl) &&
        !paymentUrl.includes(window.location.origin)
      ) {
        window.location.href = paymentUrl;
        return;
      }

      const sessionParam = response.data?.sessionId ? `&sessionId=${response.data.sessionId}` : "";
      navigate(
        `/payment?courseId=${courseId}&step=transfer&paymentMethod=${method}&amount=${
          response.data?.amount || finalAmount
        }${sessionParam}`
      );
    } catch (error) {
      setStepError(error.response?.data?.message || "Không thể khởi tạo thanh toán. Vui lòng thử lại.");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmPayment = useCallback(async () => {
    if (!courseId) {
      setPaymentMessage("Thiếu thông tin khóa học để tiếp tục thanh toán.");
      return;
    }
    if (processing) return;

    setProcessing(true);
    try {
      const response = await completeCoursePayment(courseId, {
        transactionId: transactionId.trim() || orderCode,
        sessionId,
        paymentMethod: selectedMethod,
      });

      setPaymentMessage(
        response.data?.message ||
          "Đã gửi yêu cầu. Bạn chỉ được truy cập khóa học sau khi thanh toán được xác nhận."
      );
    } catch (err) {
      setPaymentMessage(err.response?.data?.message || "Thanh toán không thành công. Vui lòng thử lại.");
    } finally {
      setProcessing(false);
    }
  }, [courseId, transactionId, orderCode, sessionId, selectedMethod, navigate, processing]);

  useEffect(() => {
    if (queryStatus === "success" && courseId && !hasConfirmedRef.current) {
      hasConfirmedRef.current = true;
      setPaymentMessage("Xác nhận thanh toán... Vui lòng chờ.");
      handleConfirmPayment();
    } else if (queryStatus === "cancel") {
      setPaymentMessage("Thanh toán bị hủy. Bạn có thể thử lại hoặc quay lại khóa học.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryStatus, courseId]);

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setPaymentMessage(`Đã sao chép: ${value}`);
    } catch (error) {
      setPaymentMessage("Không thể sao chép. Vui lòng copy thủ công.");
    }
  };

  const renderReviewStep = () => (
    <div className="payment-panel payment-review-panel">
      <div className="payment-review-header">
        <div>
          <p className="payment-kicker">Đăng Ký Khóa Học</p>
          <h2>Xác nhận thông tin và hoàn tất đăng ký</h2>
          <p className="payment-subtitle">Kiểm tra lại thông tin trước khi sang bước thanh toán.</p>
        </div>
      </div>
      <div className="payment-review-body">
        <div className="payment-course-details">
          <h3>Thông Tin Khóa Học</h3>
          {courseLoading ? (
            <p className="payment-muted">Đang tải thông tin khóa học...</p>
          ) : course ? (
            <dl className="payment-detail-list">
              <div><dt>Tên khóa học</dt><dd>{course.name}</dd></div>
              <div><dt>Danh mục</dt><dd>{course.category || "javascript"}</dd></div>
              <div><dt>Cấp độ</dt><dd>{course.level || "intermediate"}</dd></div>
            </dl>
          ) : (
            <p className="payment-error-inline">{pageError || "Không thể tải thông tin khóa học."}</p>
          )}
        </div>
        <div className="payment-amount-card">
          <div className="payment-amount-value">{(amount || 0).toLocaleString("vi-VN")} đ</div>
          <p>Thanh toán một lần - Học trọn đời</p>
        </div>
        <button className="payment-primary-button" onClick={handleStartPayment} disabled={processing || !course}>
          {processing ? "Đang chuyển tiếp..." : "Tiến Hành Thanh Toán"}
        </button>
        <p className="payment-security-note">Thanh toán an toàn và bảo mật</p>
      </div>
    </div>
  );

  const renderMethodStep = () => (
    <div className="payment-grid">
      <section className="payment-panel payment-course-panel">
        <p className="payment-kicker">Thông Tin Khóa Học</p>
        <div className="payment-course-card">
          <div className="payment-course-thumb" aria-hidden="true">{course?.name?.[0] || "C"}</div>
          <div>
            <h3>{course?.name || "Khóa học CMS"}</h3>
            <p>{course?.category || "javascript"}</p>
            <span className="payment-tag">{course?.level || "intermediate"}</span>
          </div>
        </div>
        <dl className="payment-price-breakdown">
          <div><dt>Giá khóa học</dt><dd>{(amount || 0).toLocaleString("vi-VN")} đ</dd></div>
          <div><dt>Giảm giá</dt><dd>- {(discountAmount || 0).toLocaleString("vi-VN")} đ</dd></div>
          <div className="payment-total-row"><dt>Tổng cộng</dt><dd>{finalAmount.toLocaleString("vi-VN")} đ</dd></div>
        </dl>
      </section>

      <section className="payment-panel payment-method-panel">
        <p className="payment-kicker">Chọn Phương Thức Thanh Toán</p>
        <div className="payment-voucher-box">
          <label htmlFor="couponCode">Mã giảm giá</label>
          <div className="payment-voucher-row">
            <input
              id="couponCode"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Nhập mã (VD: FREE100)"
            />
            <button type="button" onClick={applyCoupon}>Áp dụng</button>
          </div>
          <p className="payment-helper-text">{couponMessage}</p>
          {couponSummary && <p className="payment-helper-text payment-helper-highlight">{couponSummary}</p>}
        </div>

        <div className="payment-method-list">
          {[
            { value: "VNPAY", title: "VNPAY", desc: "Thanh toán qua ví điện tử, thẻ ATM", icon: "💳" },
            { value: "MOMO", title: "Ví MoMo", desc: "Thanh toán qua ví điện tử MoMo", icon: "💳" },
            { value: "BANK_TRANSFER", title: "Chuyển khoản ngân hàng", desc: "Chuyển khoản trực tiếp", icon: "🏦" },
          ].map((method) => (
            <button
              key={method.value}
              type="button"
              className={`payment-method-card${selectedMethod === method.value ? " is-selected" : ""}`}
              onClick={() => handleSelectMethod(method.value)}
              disabled={processing}
            >
              <span className="payment-method-icon">{method.icon}</span>
              <span className="payment-method-copy">
                <strong>{method.title}</strong>
                <small>{method.desc}</small>
              </span>
            </button>
          ))}
        </div>
        <button className="payment-primary-button" onClick={handleStartPayment} disabled={processing}>
          {processing ? "Đang xử lý..." : "Thanh toán an toàn"}
        </button>
        {stepError && <p className="payment-info-message">{stepError}</p>}
      </section>
    </div>
  );

  const renderTransferStep = () => {
    const bankAccountNumber = "24680006800068";
    const bankAccountName = "PHAM BA DINH";
    const bankName = vietQrBank?.shortName || "MB Bank";
    const bankBin = vietQrBank?.bin || "970422";
    const transferContent = `GHI_DANH ${courseId || "COURSE"}`;

    const qrUrl = `https://img.vietqr.io/image/${bankBin}-${bankAccountNumber}-compact2.png?amount=${
      finalAmount || amount || 0
    }&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankAccountName)}`;

    const bankDetails = [
      { label: "NGÂN HÀNG:", value: bankName },
      { label: "SỐ TÀI KHOẢN:", value: bankAccountNumber, copy: true },
      { label: "CHỦ TÀI KHOẢN:", value: bankAccountName },
      { label: "NỘI DUNG CK:", value: transferContent, copy: true },
    ];

    return (
      <div className="payment-transfer-shell">
        <div className="payment-transfer-grid">
          <div className="payment-transfer-card">
            <div className="payment-transfer-header">
              <h2>Quét mã QR</h2>
              <p>Thanh toán tự động và nhanh chóng</p>
            </div>

            <div className="payment-transfer-summary">
              <div><span>MÃ ĐƠN HÀNG:</span><strong>{orderCode}</strong></div>
              <div><span>KHÓA HỌC:</span><strong>{course?.name || courseId}</strong></div>
              <div><span>SỐ TIỀN:</span><strong className="payment-amount-strong">{finalAmount.toLocaleString("vi-VN")} đ</strong></div>
            </div>

            <div className="payment-qr-frame">
              <img alt="Mã QR thanh toán" src={qrUrl} />
            </div>

            <div className="payment-transfer-actions">
              <button type="button" className="payment-success-button" onClick={handleConfirmPayment} disabled={processing}>
                {processing ? "Đang gửi yêu cầu..." : "Tôi đã chuyển khoản"}
              </button>
              <button type="button" className="payment-cancel-button" onClick={() => navigate(`/courses/${courseId}`)}>
                Hủy
              </button>
            </div>
            {paymentMessage && <p className="payment-info-message">{paymentMessage}</p>}
          </div>

          <div className="payment-transfer-card payment-transfer-details">
            <h3 className="payment-details-title">Chuyển khoản thủ công</h3>
            <div className="payment-bank-info">
              {bankDetails.map((detail, idx) => (
                <div key={idx}>
                  <span>{detail.label}</span>
                  <strong>
                    {detail.value}
                    {detail.copy && (
                      <button type="button" onClick={() => copyToClipboard(detail.value)}>Copy</button>
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <h3 className="payment-details-title" style={{ marginTop: "24px" }}>Hướng dẫn thanh toán</h3>
            <ol className="payment-steps">
              <li>Mở ứng dụng Mobile Banking trên điện thoại.</li>
              <li>Chọn tính năng <strong>Quét mã QR</strong> hoặc chuyển khoản thủ công.</li>
              <li>Kiểm tra kĩ số tiền và <strong>Nội dung chuyển khoản</strong>.</li>
              <li>Sau khi chuyển khoản, nhấn nút "Tôi đã chuyển khoản" để gửi yêu cầu xác nhận.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="payment-page-shell">
      <div className="payment-page-header">
        <h1>Thanh toán khóa học</h1>
        <p>Đăng ký khóa học</p>
      </div>
      {pageError && <p className="payment-error-banner">{pageError}</p>}

      {step === "review" && renderReviewStep()}
      {step === "methods" && renderMethodStep()}
      {step === "transfer" && renderTransferStep()}
    </div>
  );
}

export default PaymentPage;