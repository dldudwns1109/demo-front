import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function SignupFinish() {
  const location = useLocation();
  const { userNickname } = location.state;

  const navigate = useNavigate();

  return (
    <div>
      <Header input={false} />
      <div
        className="d-flex justify-content-center h-100"
        style={{
          paddingTop: "70px",
          paddingLeft: "8.33%",
          paddingRight: "8.33%",
          paddingBottom: "80px",
        }}
      >
        <div
          className="d-flex flex-column align-items-center"
          style={{ width: "360px", marginTop: "80px" }}
        >
          <span
            className="fs-4 fw-bold text-center"
            style={{ color: "#111111" }}
          >
            회원가입이 완료되었습니다!
          </span>
          <img
            src="images/default-profile.svg"
            className="shadow-sm"
            style={{ marginTop: "48px", borderRadius: "999px" }}
            width={200}
            height={200}
          />
          <p
            className="mt-3 mb-0 fs-6 text-center"
            style={{ color: "#666666" }}
          >
            {userNickname}님 회원가입이 완료되었습니다!
            <br />
            올바른 모임 문화를 만들어주세요!
          </p>
          <button
            className="btn w-100"
            style={{
              marginTop: "48px",
              backgroundColor: "#F1F3F5",
              color: "#6C757D",
            }}
            onClick={() => navigate("/")}
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
