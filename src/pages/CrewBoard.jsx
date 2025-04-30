import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { replyCountState } from "../store/replyCountState";

export default function CrewBoard({ isCrewMember }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: "홈", path: "/crew/detail" },
    { name: "게시판", path: "/crew/board" },
    { name: "채팅", path: "/crew/chat" },
  ];

  const categories = ["전체", "공지", "후기", "자유"];
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [boardList, setBoardList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

  const replyCounts = useRecoilValue(replyCountState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/crewboard", {
          params:
            selectedCategory !== "전체" ? { category: selectedCategory } : {},
        });
        setBoardList(res.data);
        setVisibleCount(4);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [selectedCategory]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <>
      <div className="container py-4">
        {/* 상단 탭 */}
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

        {/* 카테고리 + 작성 버튼 */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="btn btn-sm rounded-pill"
                style={{
                  backgroundColor:
                    selectedCategory === cat ? "#F9B4ED" : "#ffffff",
                  color: selectedCategory === cat ? "#ffffff" : "#F9B4ED",
                  border:
                    selectedCategory === cat ? "none" : "1px solid #F9B4ED",
                  padding: "0.5rem 1rem",
                  fontSize: "0.95rem",
                }}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          {isCrewMember && (
            <Link
              to="/crew/board/write"
              className="btn btn-outline-primary btn-sm"
              style={{ padding: "0.5rem 1rem", fontSize: "0.95rem" }}
            >
              게시글 작성
            </Link>
          )}
        </div>

        {/* 게시글 카드 */}
        <div className="row">
          {boardList.length === 0 && (
            <p
              className="text-muted text-center mt-5"
              style={{ fontSize: "1rem" }}
            >
              게시글이 없습니다.
            </p>
          )}
          {boardList.slice(0, visibleCount).map((board) => (
            <div
              key={board.boardNo}
              className="col-md-6 mb-4 position-relative"
            >
              <Link
                to={`/crew/board/detail/${board.boardNo}`}
                className="text-decoration-none text-dark"
              >
                <div
                  className="card shadow-sm h-100"
                  style={{
                    backgroundColor: "rgb(241, 243, 245)",
                    border: "none",
                  }}
                >
                  <div className="card-body" style={{ padding: "1.5rem" }}>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={
                          board.boardWriterProfileUrl ||
                          "/images/default-profile.png"
                        }
                        alt="프로필"
                        className="rounded-circle me-3"
                        style={{
                          width: "3rem",
                          height: "3rem",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <strong>{board.boardWriterNickname}</strong>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {board.boardCategory} ·{" "}
                          {new Date(board.boardWriteTime).toLocaleString(
                            "ko-KR",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    <h5 className="fw-bold mb-2" style={{ fontSize: "1.2rem" }}>
                      {board.boardTitle}
                    </h5>

                    <p
                      className="text-truncate mb-2"
                      style={{ fontSize: "0.95rem", maxWidth: "100%" }}
                    >
                      {board.boardContent?.length > 20
                        ? board.boardContent.slice(0, 20) + "..."
                        : board.boardContent}
                    </p>

                    <small className="text-muted">
                      댓글 {replyCounts[board.boardNo] ?? board.boardReply}
                    </small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {visibleCount < boardList.length && (
          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={handleLoadMore}
              style={{ padding: "0.6rem 2rem", fontSize: "1rem" }}
            >
              더보기
            </button>
          </div>
        )}
      </div>
    </>
  );
}
