// components/CrewTopNav.jsx
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { name: "홈", path: "/crew/detail" },
  { name: "게시판", path: "/crew/board" },
  { name: "채팅", path: "/crew/chat" },
];

export default function CrewTopNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between border-bottom mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => navigate(tab.path)}
          className="btn btn-link position-relative text-center"
          style={{
            flex: 1,
            textDecoration: "none",
            color: location.pathname === tab.path ? "#000" : "#888",
            fontWeight: location.pathname === tab.path ? "bold" : "normal",
            padding: "1rem 0",
          }}
        >
          {tab.name}
          {location.pathname === tab.path && (
            <div
              style={{
                height: "3px",
                backgroundColor: "#000",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              }}
            ></div>
          )}
        </button>
      ))}
    </div>
  );
}
