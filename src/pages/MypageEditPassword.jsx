import { useState, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { userNoState } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

export default function MypageEditPassword() {
  const navigate = useNavigate();

  const userNo = useRecoilValue(userNoState); 

  const [originPw, setOriginPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyPassword = useCallback(async () => {
    setIsVerified(false);

    if (!originPw) {
      setMessage("현재 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/member/checkPassword", {
        memberNo: userNo,
        memberPw: originPw,
      });

      if (res.data === true) {
        setMessage("비밀번호가 확인되었습니다.");
        setIsVerified(true);
      } else {
        setMessage("비밀번호가 일치하지 않습니다.");
        setIsVerified(false); 
      }
    } catch (e) {
      console.error(e);
      setMessage("서버 오류로 비밀번호 확인에 실패했습니다.");
      setIsVerified(false);
    }
  }, [originPw, userNo]);

  const changePassword = useCallback(async () => {
    if (!newPw) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await axios.patch("http://localhost:8080/api/member/changePw", {
        memberNo: userNo,
        memberPw: newPw,
      });

      if (res.data === true) {
        const confirmed = window.confirm("비밀번호 변경이 완료되었습니다!\n로그인 페이지로 이동하시겠습니까?");
        
        // 로그아웃 처리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        if (confirmed) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/signin"; 
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/"; 
        }
      } else {
        alert("비밀번호 변경에 실패했습니다.");
      }
    } catch (e) {
      alert("서버 오류가 발생했습니다.");
      console.error(e);
    }
  }, [newPw, userNo, navigate]);

  return (
    <>
      {/* 헤더 */}
      <Header input={false} />

      <div
        className="d-flex flex-column align-items-center"
        style={{
          paddingTop: "70px",
          paddingLeft: "8.33%",
          paddingRight: "8.33%",
          paddingBottom: "80px",
        }}
      >
        <div
          className="d-flex flex-column align-items-center"
          style={{
            paddingLeft: "8.33%",
            paddingRight: "8.33%",
            paddingBottom: "80px",
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
              비밀번호 변경
            </span>
          </div>

          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "48px" }}
          >
            <div
              style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}
            >
              <label className="label-text">비밀번호 입력</label>
              <input
                type="password"
                className="member-input"
                value={originPw}
                onChange={(e) => setOriginPw(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}
          >
            <label className="label-text">비밀번호 확인</label>
            <input
              type="password"
              className="member-input"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
            />
          </div>
          <button onClick={handleVerifyPassword}>
            현재 비밀번호 확인
          </button>
          {message && (
            <div className="text-danger text-center mt-3" style={{ fontSize: "14px" }}>
              {message}
            </div>
          )}
              <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
                <label className="label-text">새 비밀번호</label>
                <input
                  type="password"
                  className="member-input"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  disabled={!isVerified}
                />
              </div>

              <div style={{ width: "360px", margin: "0 auto" }}>
                <button className="blue-btn" 
                onClick={changePassword}
                disabled={!isVerified}>
                  비밀번호 변경
                </button>
              </div>
        </div>
      </div>
    </>
  );
}
