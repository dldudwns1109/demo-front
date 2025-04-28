import Header from "../components/Header";

export default function MypageExitFinish() {
  return (
    <>
      {/* 헤더 */}
      <Header/>

      <div className="d-flex flex-column align-items-center" style={{ marginTop:"80px" }}>
        {/* 회원 탈퇴 제목 */}
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px", color:"#111111" }}>
          회원 탈퇴가 완료되었습니다
        </h1>
        {/* 회원 탈퇴 메세지 */}
        <h2 style={{ fontSize: "16px", marginBottom: "48px" }}>
          <span style={{ color:"#666666" }}>DE:MO를 이용해주셔서 진심으로 감사드립니다.</span>
        </h2>
        {/* 회원 탈퇴 이미지 */}
        <div style={{ width: "240px", height:"280px"}}>
          <img/>
        </div>
        {/* 홈이동 버튼 */}
        <div style={{ width: "360px"}}>
          <button className="light-gray-btn">
            홈으로 이동
          </button>
        </div>
      </div>
    </>
  );
}
