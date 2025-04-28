import Header from "../components/Header";

export default function MypageExit() {
  return (
    <>
      {/* 헤더 */}
      <Header/>

      <div className="d-flex flex-column align-items-center"
        style={{ marginTop: "80px" }}>
        {/* 회원 탈퇴 제목 */}
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "24px", color: "red" }}>
          회원 탈퇴
        </h1>

        {/* 탈퇴 안내 메세지 */}
        <div style={{ 
          border: "1px solid #EBEBEB", 
          padding: "16px", 
          borderRadius: "10px", 
          fontSize: "14px", 
          lineHeight: "1.6",
          width: "360px",
          backgroundColor: "transparent",
          marginBottom: "16px"
        }}>
          {/* 안내문 내용들 */}
          <p style={{ marginBottom: "12px" }}>탈퇴가 완료되면, 회원님의 모든 개인정보와 서비스 이용 기록은 영구적으로 삭제되며, 이후에는 <span style={{ color: "red"}}>어떤 방식으로도 복구가 불가능합니다.</span></p>

          <p style={{ marginBottom: "12px" }}>이는 개인정보 보호를 위한 조치이며, 탈퇴 후에는 이전에 이용하신 <span style={{ color: "red"}}>혜택, 저장된 데이터, 활동 이력 또한 모두 사라지게 됩니다.</span></p>

          <p style={{ marginBottom: "12px" }}>탈퇴가 완료된 이후에는 동일한 계정으로 <span style={{ color: "red"}}>재가입이 불가능할 수 있으며, 일부 서비스는 일정 기간 동안 재사용이 제한될 수 있습니다.</span></p>

          <p style={{ marginBottom: 0 }}>진행 전, 필요한 데이터가 있다면 반드시 미리 백업해 주세요. 계정 탈퇴는 되돌릴 수 없는 작업이므로 신중하게 결정해 주시기 바랍니다.</p>
        </div>

        {/* 동의 체크박스 */}
        <div className="d-flex align-items-center" style={{ width: "360px", marginBottom:"24px"}}>
          <input type="checkbox" style={{ width: "20px", height: "20px" }} />
          <label style={{ marginLeft: "8px", marginBottom: "0" }}>
            동의합니다
          </label>
        </div>

        {/* 비밀번호 입력 */}
        <div style={{ width: "360px", margin: "0 auto", marginBottom:"48px"}}>
          <label className="label-text">
            비밀번호 입력
          </label>

          <input type="password" 
            placeholder="사용중이신 비밀번호를 입력해주세요." 
            className="member-input"/>
        </div>

        {/* 탈퇴 버튼 */}
        <div style={{ width: "360px"}}>
          <button className="red-btn">
            회원 탈퇴하기
          </button>
        </div>
      </div>

    </>
  );
}
