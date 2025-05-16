import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Mypage.css";
import { FaRegPaperPlane } from "react-icons/fa";

export default function ProfilePopover({ memberNo, onClose }) {
  const popoverRef = useRef();
  const navigate = useNavigate();

  const [memberInfo, setMemberInfo] = useState(null);
  const [crewList, setCrewList] = useState([]);
  const [showDmInput, setShowDmInput] = useState(false);
  const [dmMessage, setDmMessage] = useState("");

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (memberNo) {
      axios.get(`http://localhost:8080/api/member/${memberNo}`).then((res) => {
        setMemberInfo(res.data);
      });
      axios
        .get(`http://localhost:8080/api/crew/joined/${memberNo}`)
        .then((res) => {
          setCrewList(res.data || []);
        });
    }
  }, [memberNo]);

  const handleDmClick = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/chat/dm/${memberNo}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.data.roomNo) {
        navigate(`/chat`);
      } else {
        setShowDmInput(true);
      }
    } catch (err) {
      console.error("DM 확인 실패", err);
    }
  }, [memberNo, navigate]);

  const handleDmSend = useCallback(async () => {
    if (!dmMessage.trim()) {
      alert("메시지를 입력해주세요!");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:8080/api/chat/dm",
        {
          targetNo: memberNo,
          content: dmMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      navigate(`/chat`);
    } catch (err) {
      console.error("DM 생성 실패", err);
    }
  }, [dmMessage, memberNo, navigate]);

  if (!memberInfo) return null;

  return (
    <div
      ref={popoverRef}
      className="shadow bg-white rounded p-3"
      style={{
        position: "absolute",
        top: "4.5rem",
        left: "0",
        zIndex: 1000,
        width: "300px",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="d-flex align-items-center justify-content-between mb-3"
        style={{ gap: "1rem" }}
      >
        {/* 프로필 이미지 */}
        <img
          src={`http://localhost:8080/api/member/image/${memberNo}`}
          alt="프로필"
          className="rounded-circle"
          style={{ width: "3.5rem", height: "3.5rem", objectFit: "cover" }}
        />

        {/* 닉네임 + MBTI */}
        <div className="text-center" style={{ flexShrink: 0 }}>
          <div className="fw-bold" style={{ fontSize: "1.1rem" }}>
            {memberInfo.memberNickname}
          </div>
          <div
            className="mbti-badge"
            style={{
              backgroundColor: "#f9b4ed",
              color: "#ffffff",
              marginTop: "4px",
              fontSize: "0.8rem",
              fontWeight: "bold",
            }}
          >
            {memberInfo.memberMbti}
          </div>
        </div>

        {/* 1:1 채팅 버튼 */}
        <button
          className="btn btn-outline-primary"
          onClick={handleDmClick}
          style={{ whiteSpace: "nowrap", height: "fit-content" }}
        >
          1:1 채팅
        </button>
      </div>

      <div className="text-muted mb-2" style={{ fontSize: "0.75rem" }}>
        {memberInfo.memberLocation} · {memberInfo.memberSchool} ·{" "}
        {memberInfo.memberBirth}
      </div>

      {showDmInput && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px", // 🔧 간격 살짝 증가
            marginTop: "12px",
          }}
        >
          <input
            type="text"
            value={dmMessage}
            onChange={(e) => setDmMessage(e.target.value)}
            placeholder="메시지 입력"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // 폼 제출 방지
                handleDmSend(); // 엔터 시 전송
              }
            }}
            style={{
              flex: 1,
              padding: "10px 14px",
              height: "42px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            onClick={handleDmSend}
            style={{
              width: "42px", // ✅ 정사각형으로 맞춤
              height: "42px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "8px", // 🔧 둥근 버튼
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FaRegPaperPlane size={18} color="#ffffff" />
          </button>
        </div>
      )}

      <hr />
      <div className="fw-bold mb-2 text-center">가입한 모임</div>
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {crewList.length === 0 ? (
          <div className="text-muted text-center">가입한 모임이 없습니다.</div>
        ) : (
          crewList.map((crew) => (
            <div
              key={crew.crewNo}
              className="d-flex align-items-center mb-3"
              onClick={() => navigate(`/crew/${crew.crewNo}/detail`)}
              style={{
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "8px",
                transition: "background-color 0.2s",
                gap: "0.8rem",
              }}
            >
              <img
                src={`http://localhost:8080/api/crew/image/${crew.crewNo}`}
                className="rounded-circle me-2"
                style={{ width: "3rem", height: "3rem", objectFit: "cover" }}
              />
              <div>
                <div className="fw-bold" style={{ fontSize: "0.75rem" }}>
                  {crew.crewName}
                </div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {crew.crewCategory} · {crew.crewLocation} · {crew.memberCount}
                  명
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
