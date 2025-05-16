import { useNavigate } from "react-router-dom";

export default function JoinBoardItem({ data }) {
  const navigate = useNavigate();
  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "#F1F3F5",
        borderRadius: "8px",
        cursor: "pointer",
      }}
      onClick={() => navigate("/join/board")}
    >
      <span className="fs-5 fw-bold" style={{ color: "#111111" }}>
        {data.boardTitle}
      </span>
      <div className="d-flex gap-3 mb-3" style={{ marginTop: "12px" }}>
        <img
          src={`http://localhost:8080/api/member/image/${data.boardWriter}`}
          width={80}
          height={80}
          style={{ borderRadius: "999px" }}
        />
        <div className="d-flex flex-column gap-2 justify-content-center">
          <span className="fs-6 fw-bold" style={{ color: "#111111" }}>
            {data.boardWriterNickname}
          </span>
          <div
            className="d-flex align-items-center gap-1"
            style={{ color: "#666666" }}
          >
            <span>{data.boardWriterGender === "m" ? "남자" : "여자"}</span> ·
            <span>{data.boardWriterBirth}</span> ·{" "}
            <span>{data.boardWriterMbti}</span>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div
          className="d-inline-flex bg-light"
          style={{
            border: "1px solid #F9B4ED",
            borderRadius: "8px",
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingTop: "7px",
            paddingBottom: "7px",
            color: "#333333",
          }}
        >
          {data.boardCategory}
        </div>
      </div>
      <p style={{ color: "#333333" }}>
        {data.boardContent.length >= 45
          ? data.boardContent.slice(0, 45) + "..."
          : data.boardContent}
      </p>
    </div>
  );
}
