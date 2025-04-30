import { useNavigate } from "react-router-dom";

export default function GroupCreateFinish() {
  const navigate = useNavigate();
  return (
      <>
        {/* 헤더 */}
        {/* <Header/> */}
  
        <div className="d-flex flex-column align-items-center" style={{ paddingTop:"70px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px", color:"#111111" }}>
            모임 개설이 완료되었습니다
          </h1>
          <div style={{ marginBottom: "16px"}}>
            <img className="memberProfile" src="crewImg"/>
          </div>
          <div>
            <h2 style={{ fontSize: "16px", marginBottom: "48px" }}>
              <span style={{ color:"#666666", fontWeight: "bold" }}>
                LOL Silver를 넘어 Platinum으로 모임 개설이 완료되었습니다.
              </span>
            </h2>
          </div>
          {/* 홈이동 버튼 */}
          <div style={{ width: "360px"}}>
            <button className="light-gray-btn"
              onClick={()=>navigate("/")}>
              홈으로 이동
            </button>
          </div>
        </div>
      </>
    );
}
