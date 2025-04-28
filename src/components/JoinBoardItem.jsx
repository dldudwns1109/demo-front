export default function JoinBoardItem({ data }) {
  return (
    <div
      className="p-4"
      style={{ backgroundColor: "#F1F3F5", borderRadius: "8px" }}
    >
      <span className="fs-5 fw-bold" style={{ color: "#111111" }}>
        {data.title}
      </span>
      <div className="d-flex gap-3 mb-3" style={{ marginTop: "12px" }}>
        <img
          src={data.img}
          width={80}
          height={80}
          style={{ borderRadius: "999px" }}
        />
        <div className="d-flex flex-column gap-2 justify-content-center">
          <span className="fs-6 fw-bold" style={{ color: "#111111" }}>
            {data.username}
          </span>
          <div
            className="d-flex align-items-center gap-1"
            style={{ color: "#666666" }}
          >
            <span>{data.gender}</span> ·<span>{data.birth}</span> ·{" "}
            <span>{data.mbti}</span>
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
          {data.like}
        </div>
      </div>
      <p style={{ color: "#333333" }}>{data.context}</p>
    </div>
  );
}
