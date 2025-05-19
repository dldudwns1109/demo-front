import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Unauthorized from "../components/Unauthorized";

export default function SignupFinish() {
  const location = useLocation();
  const { userNickname } = location?.state || {};

  const [memberNo, setMemberNo] = useState(null);
  const isAccessed = useMemo(() => userNickname !== undefined, [userNickname]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAccessed) return;

    const fetchData = async () => {
      const res = await axios.get(
        `/member/findMemberNo/${userNickname}`
      );
      setMemberNo(res.data);
    };

    fetchData();
  }, [isAccessed]);

  return (
    <div className="vh-100">
      <Header input={false} />
      {isAccessed ? (
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
              src={
                memberNo === null
                  ? "images/default-profile.svg"
                  : `/member/image/${memberNo}`
              }
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
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}
