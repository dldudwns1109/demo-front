import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Header from "../components/Header";

import { FaSpinner } from "react-icons/fa";
import "../css/spinner.css";

export default function FindPassword() {
  const [memberEmail, setMemberEmail] = useState("");
  const [blurMessage, setBlurMessage] = useState("");
  const [isLoading, setIsLoading] = useState(null);

  const isValid = useMemo(() => blurMessage === "");

  const emailInputRef = useRef(null);

  const errorToastify = (message) => toast.error(message);

  const navigate = useNavigate();

  const checkFindPassword = async (e) => {
    if (e.key === "Enter" || e.key === undefined) {
      if (!memberEmail.length) {
        errorToastify("이메일 주소를 입력해주세요.");
        return;
      }

      setIsLoading(true);

      try {
        const res = await axios.patch(
          `http://localhost:8080/api/member/updatePw`,
          { memberEmail }
        );

        if (res.status === 200) setIsLoading(false);
      } catch (e) {
        setBlurMessage("임시 비밀번호 전송에 실패했습니다.");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", checkFindPassword);

    return () => {
      window.removeEventListener("keydown", checkFindPassword);
    };
  }, [memberEmail]);

  return (
    <div className="vh-100">
      <Header input={false} />
      <div
        className="d-flex justify-content-center h-100"
        style={{
          paddingTop: "70px",
          paddingLeft: "8.33%",
          paddingRight: "8.33%",
        }}
      >
        {/* null값이 포함되는 경우를 방지하기 위해 직접 비교 */}
        {isLoading === false ? (
          <div
            className="d-flex flex-column align-items-center"
            style={{ width: "360px", marginTop: "80px" }}
          >
            <span
              className="fs-4 fw-bold text-center"
              style={{ color: "#111111" }}
            >
              임시 비밀번호 전송을 완료했습니다!
            </span>
            <p className="mt-4 fs-6 text-center" style={{ color: "#666666" }}>
              이메일에서 임시 비밀번호를 확인해주세요!
            </p>
            <img
              src="images/mail.svg"
              style={{ marginTop: "48px" }}
              width={280}
              height={280}
            />
            <button
              className="btn w-100"
              style={{
                marginTop: "48px",
                backgroundColor: "#F1F3F5",
                color: "#6C757D",
              }}
              onClick={() => navigate("/signin")}
            >
              로그인 페이지로 이동
            </button>
          </div>
        ) : (
          <div
            className="d-flex flex-column"
            style={{ width: "360px", marginTop: "80px" }}
          >
            <span
              className="fs-4 fw-bold text-center"
              style={{ color: "#111111" }}
            >
              비밀번호 찾기
            </span>
            <div
              className="d-flex flex-column gap-2"
              style={{ marginTop: "48px" }}
            >
              <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
                이메일
              </label>
              <input
                type="email"
                className="border-0 py-2"
                style={{
                  backgroundColor: "#F1F3F5",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  borderRadius: "8px",
                  outline: 0,
                }}
                placeholder="이메일을 입력해주세요."
                ref={emailInputRef}
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                onBlur={() => {
                  if (!memberEmail.length) {
                    setBlurMessage("이메일 주소를 입력해주세요.");
                    return;
                  }

                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
                    setBlurMessage("올바른 이메일 주소를 입력해주세요.");
                    return;
                  }

                  setBlurMessage("");
                }}
              />
            </div>
            <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage}
              </span>
            </div>
            <button
              className="d-flex btn btn-primary text-white justify-content-center align-items-center gap-2"
              style={{ marginTop: "48px" }}
              onClick={(e) => checkFindPassword(e)}
              disabled={!isValid}
            >
              {isLoading ? (
                <>
                  <span>임시 비밀번호 전송 중</span>{" "}
                  <FaSpinner className="fa-spin" />
                </>
              ) : (
                "비밀번호 찾기"
              )}
            </button>
          </div>
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        pauseOnHover={false}
        theme="light"
        limit={1}
      />
    </div>
  );
}
