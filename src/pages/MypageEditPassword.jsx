import { useState, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { loginState, userNoState } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Unauthorized from "../components/Unauthorized";
import "../css/Mypage.css";

export default function MypageEditPassword() {
  const navigate = useNavigate();

  const userNo = useRecoilValue(userNoState);
  const login = useRecoilValue(loginState);

  const [originPw, setOriginPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyPassword = useCallback(async () => {
    setIsVerified(false);

    if (!originPw) {
      setMessage("현재 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post(
        "/member/checkPassword",
        {
          memberNo: userNo,
          memberPw: originPw,
        }
      );

      if (res.data === true) {
        toast.success("비밀번호가 확인되었습니다!");
        setIsVerified(true);
      } else {
        toast.error("비밀번호가 일치하지 않습니다!");
        setIsVerified(false);
      }
    } catch (e) {
      console.error(e);
      setMessage("서버 오류로 비밀번호 확인에 실패했습니다!");
      setIsVerified(false);
    }
  }, [originPw, userNo]);

  const changePassword = useCallback(async () => {
    if (!newPw) {
      toast.error("새 비밀번호를 입력해주세요!");
      return;
    }

    if (!isVerified) {
      toast.error("현재 비밀번호 확인이 필요합니다!");
      return;
    }

    if (originPw === newPw) {
      toast.error("현재 비밀번호와 같습니다!");
      return;
    }

    try {
      const res = await axios.patch(
        "/member/changePw",
        {
          memberNo: userNo,
          memberPw: newPw,
        }
      );

      if (res.data === true) {
        const confirmed = window.confirm(
          "비밀번호 변경이 완료되었습니다!\n로그인 페이지로 이동하시겠습니까?"
        );

        // 로그아웃 처리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        if (confirmed) {
          window.location.href = "/signin";
        } else {
          window.location.href = "/";
        }
      } else {
        toast.error("비밀번호 변경에 실패했습니다!");
      }
    } catch (e) {
      toast.error("서버 오류가 발생했습니다!");
      console.error(e);
    }
  }, [newPw, originPw, isVerified, userNo, navigate]);

  if (!login) {
    return (
      <div className="vh-100">
        <Header input={false} loginState={`${login ? "loggined" : "login"}`} />
        <Unauthorized />
      </div>
    );
  }

  // 공통 래퍼 스타일
  const boxStyle = {
    width: "100%",
    maxWidth: "380px",
    padding: "0 16px",
    margin: "0 auto 24px",
  };

  return (
    <>
      {/* 헤더 */}
      <Header input={false} />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        pauseOnHover={false}
        theme="light"
        limit={1}
      />
      <div
        className="d-flex flex-column align-items-center"
        style={{ paddingTop: 70, paddingBottom: 80 }}
      >
        <h2
          style={{
            margin: "60px 0 24px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#111",
          }}
        >
          비밀번호 변경
        </h2>

        <div style={boxStyle}>
          <label className="label-text">비밀번호 입력</label>
          <input
            type="password"
            className="member-input"
            value={originPw}
            onChange={(e) => setOriginPw(e.target.value)}
            disabled={isVerified}
          />
        </div>

        <div>
          {!isVerified && (
            <div style={boxStyle}>
              <button
                type="button"
                className="light-gray-btn"
                style={{
                  backgroundColor: "#6C757D",
                  color: "#ffffff",
                }}
                onClick={handleVerifyPassword}
              >
                현재 비밀번호 확인
              </button>
            </div>
          )}
        </div>
        <div style={boxStyle}>
          <label className="label-text">새 비밀번호</label>
          <input
            type="password"
            className="member-input"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
          />
        </div>

        <div style={boxStyle}>
          <button className="blue-btn" onClick={changePassword}>
            비밀번호 변경
          </button>
        </div>
      </div>
    </>
  );
}
