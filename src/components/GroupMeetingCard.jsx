import { useNavigate } from "react-router-dom";

export default function GroupMeetingCard({ meeting, crewNo }) {
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
      className="w-100"
      style={{
        width: "100%",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <img
        src={
          meeting.attachmentNo
            ? `/attachment/${meeting.attachmentNo}`
            : "${import.meta.env.VITE_AJAX_BASE_URL}/images/default-thumbnail.png"
        }
        alt="썸네일"
        style={{
          width: "100%",
          height: "240px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      <div
        style={{
          fontWeight: "bold",
          fontSize: "20px",
          color: "#111111",
        }}
      >
        {meeting.meetingCrewName}
      </div>

      <div
        style={{
          fontWeight: "bold",
          fontSize: "16px",
          color: "#333333",
        }}
      >
        {meeting.meetingName}
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#666666",
          display: "flex",
          gap: "4px",
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
