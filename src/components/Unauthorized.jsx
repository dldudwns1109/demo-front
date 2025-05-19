export default function Unauthorized() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center gap-4"
      style={{ paddingTop: "70px" }}
    >
      <img
        style={{ marginTop: "80px" }}
        src="${import.meta.env.VITE_AJAX_BASE_URL}/images/no-authorized.svg"
        width={240}
      />
      <span className="fs-6" style={{ color: "#333333" }}>
        잘못된 접근입니다.
      </span>
    </div>
  );
}
