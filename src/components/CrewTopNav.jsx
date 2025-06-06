// components/CrewTopNav.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";

const tabs = [
  { name: "홈", path: "detail" },
  { name: "게시판", path: "board" },
  { name: "채팅", path: "chat" },
];

export default function CrewTopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { crewNo } = useParams();

  return (
    <div
      style={{
        position: "sticky",
        top: "0",
        backgroundColor: "#fff",
        zIndex: "1000",
      }}
    >
      <div className="d-flex justify-content-between border-bottom">
        {tabs.map((tab) => {
          const fullPath = `/crew/${crewNo}/${tab.path}`;
          const isActive = location.pathname.includes(fullPath);
          return (
            <button
              key={tab.name}
              onClick={() => navigate(fullPath)}
              className="btn btn-link position-relative text-center"
              style={{
                flex: 1,
                textDecoration: "none",
                color: isActive ? "#000" : "#888",
                fontWeight: isActive ? "bold" : "normal",
                padding: "1rem 0",
                borderBottom: isActive && "2px solid black",
                borderRadius: 0,
              }}
            >
              {tab.name}
              {/* {isActive && (
                <div
                  style={{
                    height: "2px",
                    backgroundColor: "#000",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}
                ></div>
              )} */}
            </button>
          );
        })}
      </div>
    </div>
  );
}
