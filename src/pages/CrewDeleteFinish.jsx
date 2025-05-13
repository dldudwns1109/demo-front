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
              모임 해체가 완료되었습니다
            </span>
            <p
              className="mt-0 fs-6"
              style={{ marginBottom: "48px", lineHeight: "1.5" }}
            >
              <span style={{ color: "#666666", display: "block" }}>
                DE:MO를 이용해 소중한 모임을 만들어주셔서
              </span>
              <span
                style={{
                  color: "#666666",
                  display: "block",
                  textAlign: "center",
                }}
              >
                진심으로 감사드립니다.
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
