import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

export default function CrewCreateFinish() {
  const location = useLocation();
  const navigate = useNavigate();
  const crewNo = new URLSearchParams(location.search).get("crewNo");

  const [crew, setCrew] = useState(null);

  useEffect(() => {
    if (!crewNo) return;

    axios
      .get(`http://localhost:8080/api/crew/${crewNo}`)
      .then((res) => setCrew(res.data))
      .catch(() => alert("모임 정보를 불러오지 못했습니다."));
  }, [crewNo]);

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
            모임개설이 완료되었습니다!
          </span>

          {crew ? (
            <>
              <img
                src={`http://localhost:8080/api/crew/image/${crewNo}`}
                className="shadow-sm"
                style={{ marginTop: "48px", borderRadius: "999px" }}
                width={200}
                height={200}
              />
              <p
                className="mt-3 mb-0 fs-6 text-center"
                style={{ color: "#666666" }}
              >
                <strong>{crew.crewName}</strong> 모임이 개설되었습니다!
                <br />
                올바른 모임 문화를 만들어주세요!
              </p>
            </>
          ) : (
            <p style={{ marginTop: "64px", color: "#999999" }}>
              모임 정보를 불러오는 중입니다...
            </p>
          )}

          <button
            className="btn w-100"
            style={{
              marginTop: "48px",
              backgroundColor: "#F1F3F5",
              color: "#6C757D",
            }}
            onClick={() => navigate(`/crew/${crewNo}/detail`)}
          >
            모임 상세페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
}