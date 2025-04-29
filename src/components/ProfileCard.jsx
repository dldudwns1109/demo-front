import { FaCog } from "react-icons/fa";
import "../css/Mypage.css";
import { useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";
import { useCallback, useEffect, useRef } from "react";

export default function ProfileCard({ member }) {
  const navigate = useNavigate();

  {/* 모달(Modal) */}
  const modal = useRef();
  
  const openModal = useCallback(()=>{
    const target = Modal.getOrCreateInstance(modal.current);
    target.show();
  }, []);
  const closeModal = useCallback(()=>{
    const target = Modal.getInstance(modal.current);
    if(target !== null) target.hide();
}, [modal]);

  //effect

  //callback

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
            <button className="creat-crew-btn"
                onClick={() => navigate("/group/create")}>
              모임 개설
            </button>
            <button className="btn btn-light btn-sm" 
              style={{ backgroundColor: "transparent", border: "none" }}
              onClick={openModal}
            >
              <FaCog/>
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
      {/* 모달(Modal) */}
      <div className="modal fade" ref={modal} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body d-flex flex-column p-0">
              {/* 개인정보수정 */}
              <button type="button" 
                className="custom-modal-button custom-modal-button-first"
                onClick={() => {
                  closeModal();
                  navigate("/mypage/edit");
                }}
              >
                개인정보변경
              </button>
              {/* 로그아웃 */}
              <button type="button"
                className="custom-modal-button"
                onClick={() => {
                  const choice = window.confirm("정말 로그아웃 하시겠습니까?");
                  if (!choice) {
                    return;
                  }
                  closeModal();
                  navigate("/");
                }}
              >
                로그아웃
              </button>
              {/* 회원탈퇴 */}
              <button type="button" 
                className="custom-modal-button custom-modal-button-last"
                onClick={() => {
                  closeModal();
                  navigate("/mypage/exit");
                }}
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
