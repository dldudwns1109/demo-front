import React from "react";

export default function MeetingDelegateModal({
  memberList,
  userNo,
  onClose,
  selectedMember,
  setSelectedMember,
  onDelegate,
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "12px",
          minWidth: "360px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: "16px" }}>모임장 위임 대상 선택</h3>
        {memberList
          .filter((m) => m.memberNo !== userNo)
          .map((member) => (
            <div
              key={member.memberNo}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 0",
                borderBottom: "1px solid #ddd",
                cursor: "pointer",
              }}
              onClick={() => setSelectedMember(member)}
            >
              <img
                src={
                  member.attachmentNo
                    ? `http://localhost:8080/api/attachment/${member.attachmentNo}`
                    : "/images/default-profile.png"
                }
                alt="profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <span>{member.memberNickname}</span>
            </div>
          ))}

        {selectedMember && (
          <div style={{ marginTop: "16px" }}>
            <p>
              <strong>{selectedMember.memberNickname}</strong>님에게
              모임장을 위임하시겠습니까?
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button
                style={{
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "6px",
                }}
                onClick={onDelegate}
              >
                위임하기
              </button>
              <button
                style={{
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "6px",
                }}
                onClick={() => setSelectedMember(null)}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
