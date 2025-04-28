import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Signin() {
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="vh-100" style={{ backgroundColor: "#FAFAFA" }}>
      <Header input={false} />
      <div
        className="h-100 d-flex justify-content-center align-items-center"
        style={{
          paddingTop: "70px",
          paddingBottom: "80px",
          paddingLeft: "8.33%",
          paddingRight: "8.33%",
        }}
      >
        <div
          className={`bg-white d-flex shadow-lg ${
            windowWidth < 1024 && "flex-column"
          }`}
          style={{ width: "69.4%", height: "35rem", borderRadius: "8px" }}
        >
          <div
            className="d-flex flex-column pt-4 pb-4"
            style={{
              width: `${windowWidth > 1024 ? "48%" : "100%"}`,
              backgroundImage: "linear-gradient(to bottom, #DABFFF, #F9B4ED)",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: `${windowWidth > 1024 ? "0px" : "8px"}`,
              borderBottomLeftRadius: `${windowWidth > 1024 ? "8px" : "0px"}`,
            }}
          >
            <div
              className="d-inline-flex flex-column justify-content-center align-items-center h-100"
              style={{ paddingLeft: "20.8%", paddingRight: "20.8%" }}
            >
              <img src="/images/logo-light.svg" className="mb-4" />
              <span className="text-white fs-4 fw-bold text-center">
                취미 문화를 만들어나가요!
              </span>
              <button
                className="bg-transparent text-white fs-6 fw-bold w-100"
                style={{
                  border: "solid 1px white",
                  borderRadius: "8px",
                  marginTop: "114px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "7px",
                  paddingBottom: "7px",
                }}
                onClick={() => navigate("/signup")}
              >
                회원 가입
              </button>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center h-100 flex-grow-1">
            <div className="d-inline-flex">
              <img src="/images/logo.svg" />
            </div>
            <input type="text" />
            <input type="text" />
            <div className="d-flex">
              <input type="checkbox" id="saveId" />
              <label htmlFor="saveId">아이디 저장</label>
            </div>
            <button>로그인</button>
            <div className="d-flex">
              <button>아이디 찾기</button>
              <button>비밀번호 찾기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
