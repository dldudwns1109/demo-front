import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Header from "../components/Header";
import { windowWidthState } from "../utils/storage";

export default function Signin() {
  const windowWidth = useRecoilValue(windowWidthState);

  const navigate = useNavigate();

  return (
    <div className="vh-100" style={{ backgroundColor: "#FAFAFA" }}>
      <Header input={false} />
      <div
        className={`${
          windowWidth < 768 && "w-100"
        } h-100 d-flex justify-content-center align-items-center`}
        style={{
          paddingTop: "70px",
          paddingLeft: "8.33%",
          paddingRight: "8.33%",
        }}
      >
        <div
          className={`${
            windowWidth < 768 && "w-100"
          } bg-white d-flex shadow-lg ${windowWidth < 1024 && "flex-column"}`}
          style={{
            width: "69.4%",
            height: `${windowWidth > 1024 ? "35rem" : "auto"}`,
            borderRadius: "8px",
          }}
        >
          <div
            className={`d-flex flex-column ${windowWidth < 1024 && "py-5"}`}
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
          <div
            className={`d-flex flex-column justify-content-center align-items-center h-100 flex-grow-1 ${
              windowWidth < 1024 && "py-5"
            }`}
          >
            <div className="d-inline-flex mb-4">
              <img src="/images/logo.svg" />
            </div>
            <div className="d-flex flex-column">
              <div className="d-flex flex-column mb-3" style={{ gap: "12px" }}>
                <input
                  type="text"
                  className="border-0 py-2"
                  style={{
                    width: "256px",
                    outline: 0,
                    backgroundColor: "#F1F3F5",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    borderRadius: "8px",
                  }}
                  placeholder="닉네임"
                />
                <input
                  type="password"
                  className="border-0 py-2"
                  style={{
                    width: "256px",
                    outline: 0,
                    backgroundColor: "#F1F3F5",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    borderRadius: "8px",
                  }}
                  placeholder="비밀번호"
                />
              </div>
              <div className="d-flex gap-2 mb-4">
                <input
                  type="checkbox"
                  id="saveId"
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "1px solid #EBEBEB",
                  }}
                />
                <label
                  htmlFor="saveId"
                  style={{ fontSize: "14px", color: "#333333" }}
                >
                  아이디 저장
                </label>
              </div>
              <button
                className="btn btn-primary text-white mb-3"
                style={{ width: "256px" }}
              >
                로그인
              </button>
              <div
                className="d-flex"
                style={{ paddingTop: "12px", borderTop: "1px solid #EBEBEB" }}
              >
                <button
                  className="bg-white px-2 border-top-0 border-bottom-0 border-start-0"
                  style={{
                    borderRight: "1px solid #EBEBEB",
                    color: "#666666",
                    fontSize: "14px",
                  }}
                >
                  아이디 찾기
                </button>
                <button
                  className="bg-white px-2 border-0"
                  style={{ color: "#666666", fontSize: "14px" }}
                >
                  비밀번호 찾기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
