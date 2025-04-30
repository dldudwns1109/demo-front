import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { replyCountState } from "../store/replyCountState";
import CrewTopNav from "../components/CrewTopNav"; // 상단 탭바 컴포넌트 import

// 크루 게시판 컴포넌트
export default function CrewBoard({ isCrewMember }) {
  const categories = ["전체", "공지", "후기", "자유"];
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [boardList, setBoardList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

  const replyCounts = useRecoilValue(replyCountState);

  // 카테고리 변경 시 게시글 리스트 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/crewboard", {
          params:
            selectedCategory !== "전체" ? { category: selectedCategory } : {},
        });
        setBoardList(res.data);
        setVisibleCount(4); // 카테고리 변경 시 초기 4개만 보여줌
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [selectedCategory]);

  // 카테고리 버튼 클릭 핸들러
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
  };

  // 더보기 버튼 클릭 시 추가 게시글 표시
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  //view
  return (
    <>
      {/* <Header loginState="login" /> */}
      <div className="container py-4">
        {/* 상단 탭바 */}
        <CrewTopNav />

        {/* 카테고리 버튼 + 게시글 작성 버튼 */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          {/* 카테고리 필터 */}
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="btn btn-sm rounded-pill"
                style={{
                  backgroundColor:
                    selectedCategory === cat ? "#000000" : "rgb(241, 243, 245)",
                  color: selectedCategory === cat ? "#ffffff" : "#000000",
                  border: "none",
                  padding: "0.5rem 1rem",
                  fontSize: "0.95rem",
                }}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 게시글 작성 버튼 (모임 회원만 보임) */}
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

        {/* 게시글 카드 목록 */}
        <div className="row">
          {/* 게시글이 없을 경우 */}
          {boardList.length === 0 && (
            <p
              className="text-muted text-center mt-5"
              style={{ fontSize: "1rem" }}
            >
              게시글이 없습니다.
            </p>
          )}

          {/* 게시글 카드 출력 */}
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
                    {/* 작성자 정보 */}
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
                          {/* 카테고리 · 작성 시간 */}
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

                    {/* 게시글 제목 */}
                    <h5 className="fw-bold mb-2" style={{ fontSize: "1.2rem" }}>
                      {board.boardTitle}
                    </h5>

                    {/* 게시글 내용 요약 */}
                    <p
                      className="text-truncate mb-2"
                      style={{ fontSize: "0.95rem", maxWidth: "100%" }}
                    >
                      {board.boardContent?.length > 20
                        ? board.boardContent.slice(0, 20) + "..."
                        : board.boardContent}
                    </p>

                    {/* 댓글 수 */}
                    <small className="text-muted">
                      댓글 {replyCounts[board.boardNo] ?? board.boardReply}
                    </small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* 더보기 버튼 */}
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