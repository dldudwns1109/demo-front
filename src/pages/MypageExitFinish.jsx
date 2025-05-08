import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Header from "../components/Header";
import Unauthorized from "../components/Unauthorized";
import { loginState } from "../utils/storage";

export default function MypageExitFinish() {
  const login = useRecoilValue(loginState);
  const location = useLocation();
  const { isFinish } = location?.state || {};
  const navigate = useNavigate();

  return (
    <div className="vh-100">
      <Header input={false} loginState={`${login ? "loggined" : "login"}`} />

      {isFinish ? (
        <div className="d-flex justify-content-center">
          <div
            className="d-flex flex-column align-items-center"
            style={{ paddingTop: "70px", width: "360px" }}
          >
            <span
              className="fs-4 fw-bold"
              style={{
                marginTop: "80px",
                marginBottom: "24px",
                color: "#111111",
              }}
            >
              회원 탈퇴가 완료되었습니다
            </span>
            <p className="mt-0 fs-6" style={{ marginBottom: "48px" }}>
              <span style={{ color: "#666666" }}>
                DE:MO를 이용해주셔서 진심으로 감사드립니다.
              </span>
            </p>
            <div style={{ marginBottom: "48px" }}>
              <img src="/images/exit-finish.svg" />
            </div>
            <button
              className="light-gray-btn w-100"
              onClick={() => navigate("/")}
            >
              홈으로 이동
            </button>
          </div>
        </div>
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}
