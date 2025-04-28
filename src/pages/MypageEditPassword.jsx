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
          <label 
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#333333"
            }}>
            비밀번호 입력
          </label>

          <input 
            type="password"
            style={{
              width: "360px",
              height: "36px",
              padding: "12px",
              paddingTop: "8px",
              paddingBottom: "8px",
              fontSize: "14px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#f1f3f5"
            }}/>
          </div>
          <div style={{ width: "360px", margin: "0 auto", marginBottom:"16px"}}>
          <label 
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#333333"
            }}>
            비밀번호 확인
          </label>

          <input 
            type="password"
            style={{
              width: "360px",
              height: "36px",
              padding: "12px",
              paddingTop: "8px",
              paddingBottom: "8px",
              fontSize: "14px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#f1f3f5"
            }}/>
          </div>
          <div style={{ width: "360px", margin: "0 auto", marginBottom:"48px"}}>
          <label 
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#333333"
            }}>
            새비빌번호 입력
          </label>

          <input 
            type="password"
            style={{
              width: "360px",
              height: "36px",
              padding: "12px",
              paddingTop: "8px",
              paddingBottom: "8px",
              fontSize: "14px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#f1f3f5"
            }}/>
          </div>
          <div style={{ width: "360px", margin: "0 auto" }}>
            <button 
                style={{
                  width: "100%",
                  padding: "12px",
                  paddingTop: "7px",
                  paddingBottom: "7px",
                  backgroundColor: "#007bff",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                비밀번호 변경
            </button>
          </div>
      </div>
    </>
  );
}
