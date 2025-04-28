import { FaCog } from "react-icons/fa";
import "../css/Mypage.css";

export default function ProfileCard({ member }) {
  if (!member) return <div className="text-center">회원 정보를 불러오는 중입니다...</div>;
  return (
    <div className="container">
      <div className="d-flex align-items-start justify-content-center mt-4">
        {/* 이미지 박스 */}
        <div className="profile-left">
          <img className="memberProfile" />
        </div>

        {/* 정보 박스 */}
        <div className="profile-right ms-5">
          <div className="d-flex align-items-center gap-3 mb-3">
            <span style={{ fontSize: "24px", fontWeight: "bold", color: "#111111" }}>
              {member.memberNickname}
            </span>
            <span className="mbti-badge">{member.mbti}</span>
            <button className="creat-crew-btn">모임 개설</button>
            <button className="btn btn-light btn-sm" style={{ backgroundColor: "transparent", border: "none" }}>
              <FaCog />
            </button>
          </div>
          <div className="d-flex align-items-center gap-3 mb-4 text-muted small">
            <div>{member.location}</div>
            <span>·</span>
            <div>{member.school}</div>
            <span>·</span>
            <div>{member.birth}</div>
          </div>
          <p style={{ marginBottom: "40px" }}>{member.statusMessage}</p>
          <div className="d-flex flex-wrap gap-2">
            {member.likeList.map((like, v) => (
              <span key={v} className="mbti-badge">{like}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
