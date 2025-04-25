import { FaCog } from "react-icons/fa";
import "../css/Mypage.css";

export default function ProfileCard({ user }) {
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
              {user.name}
            </span>
            <span className="mbti-badge">{user.mbti}</span>
            <button className="creat-crew-btn">모임 개설</button>
            <button className="btn btn-light btn-sm" style={{ backgroundColor: "transparent", border: "none" }}>
              <FaCog />
            </button>
          </div>
          <div className="d-flex align-items-center gap-3 mb-4 text-muted small">
            <div>{user.location}</div>
            <span>·</span>
            <div>{user.school}</div>
            <span>·</span>
            <div>{user.birth}</div>
          </div>
          <p style={{ marginBottom: "40px" }}>{user.statusMessage}</p>
          <div className="d-flex flex-wrap gap-2">
            {user.likeList.map((like, v) => (
              <span key={v} className="mbti-badge">{like}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
