import Header from "../components/Header";

export default function MypageEditPassword() {
  return (
    <>
      {/* 헤더 */}
      <Header/>

      <div className="d-flex flex-column align-items-center" style={{ marginTop:"80px" }}>
        {/* 회원 탈퇴 제목 */}
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "48px", color:"#111111" }}>
          비밀번호 변경
        </h1>
        <div style={{ width: "360px", margin: "0 auto", marginBottom:"16px"}}>
          <label className="label-text">
            비밀번호 입력
          </label>

          <input type="password" className="member-input"/>
        </div>
          <div style={{ width: "360px", margin: "0 auto", marginBottom:"16px"}}>
          <label className="label-text">
            비밀번호 확인
          </label>

          <input type="password" className="member-input"/>
        </div>
          <div style={{ width: "360px", margin: "0 auto", marginBottom:"48px"}}>
          <label className="label-text">
            새비빌번호 입력
          </label>

          <input type="password" className="member-input"/>
        </div>
          <div style={{ width: "360px", margin: "0 auto" }}>
            <button className="blue-btn">
                비밀번호 변경
            </button>
          </div>
      </div>
    </>
  );
}
