import { useNavigate } from "react-router-dom";

export default function MeetingCard({ meeting, crewNo }) {
  const navigate = useNavigate();

  const date = new Date(meeting.meetingDate);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const dateStr = isToday
    ? "오늘"
    : date.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
      });

  return (
    <div
      onClick={() =>
        navigate(`/meeting/detail/${meeting.meetingNo}`, {
          state: { crewNo },
        })
      }
      style={{
        width: "360px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <img
        src={
          meeting.attachmentNo
            ? `http://localhost:8080/api/attachment/${meeting.attachmentNo}`
            : "/images/default-thumbnail.png"
        }
        alt="썸네일"
        style={{
          width: "100%",
          height: "270px",
          objectFit: "cover",
          borderRadius: "16px",
        }}
      />

      <div 
        style={{ 
            fontWeight: "bold", 
            fontSize: "20px", 
            color: "#111111",

        }}>
        {meeting.meetingName}
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#666666",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span>{meeting.meetingLocation?.split(" ")[0]}</span>
        <span>·</span>
        <span>{dateStr}</span>
        <span>·</span>
        <span>참여인원 {meeting.memberCount ?? 0}명</span>
      </div>
    </div>
  );
}
