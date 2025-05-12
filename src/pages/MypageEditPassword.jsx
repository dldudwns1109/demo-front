import Header from "../components/Header";

export default function MypageEditPassword() {
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
        {/* 회원 탈퇴 제목 */}
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
              <input type="password" className="member-input" />
            </div>
          </div>

          <div
            style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}
          >
            <label className="label-text">비밀번호 확인</label>
            <input type="password" className="member-input" />
          </div>

          <div
            style={{ width: "360px", margin: "0 auto", marginBottom: "48px" }}
          >
            <label className="label-text">새 비밀번호 입력</label>
            <input type="password" className="member-input" />
          </div>

          <div style={{ width: "360px", margin: "0 auto" }}>
            <button className="blue-btn">비밀번호 변경</button>
          </div>
        </div>
      </div>
    </>
  );
}
