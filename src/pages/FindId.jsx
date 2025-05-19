import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Header from "../components/Header";

export default function FindId() {
  const [memberEmail, setMemberEmail] = useState("");
  const [blurMessage, setBlurMessage] = useState("");
  const [findId, setFindId] = useState("");

  const isValid = useMemo(() => blurMessage === "");

  const emailInputRef = useRef(null);

  const errorToastify = (message) => toast.error(message);

  const navigate = useNavigate();

  const checkFindId = async (e) => {
    if (e.key === "Enter" || e.key === undefined) {
      if (!memberEmail.length) {
        errorToastify("이메일 주소를 입력해주세요.");
        return;
      }

      const res = await axios.get(
        `/member/memberEmail/${memberEmail}`
      );

      if (res.data === "") {
        errorToastify("존재하지 않는 아이디입니다.");
      }

      setFindId(res.data);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", checkFindId);

    return () => {
      window.removeEventListener("keydown", checkFindId);
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
        <div
          className="d-flex flex-column"
          style={{ width: "360px", marginTop: "80px" }}
        >
          <span
            className="fs-4 fw-bold text-center"
            style={{ color: "#111111" }}
          >
            아이디 찾기
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
          {findId && (
            <div className="mt-2 fs-6" style={{ color: "#333333" }}>
              <span>
                회원님의 아이디는{" "}
                <span className="fw-bold" style={{ color: "#F9B4ED" }}>
                  {findId}
                </span>
                입니다.
              </span>
            </div>
          )}
          {!findId ? (
            <button
              className="btn btn-primary text-white"
              style={{ marginTop: "48px" }}
              onClick={(e) => checkFindId(e)}
              disabled={!isValid}
            >
              아이디 찾기
            </button>
          ) : (
            <button
              className="btn"
              style={{
                marginTop: "48px",
                backgroundColor: "#F1F3F5",
                color: "#6C757D",
              }}
              onClick={() => navigate("/signin")}
            >
              로그인 페이지로 이동
            </button>
          )}
        </div>
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
