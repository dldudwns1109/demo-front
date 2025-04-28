import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

export default function JoinBoard() {
  const categories = [
    "전체", "스포츠", "사교", "독서", "여행", "음악", "게임", "공연", "자기개발", "요리"
  ];
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [boardList, setBoardList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/board", {
          params: selectedCategory !== "전체" ? { category: selectedCategory } : {},
        });
        setBoardList(res.data);
        setVisibleCount(4); // 카테고리 바뀌면 다시 4개로 리셋
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
    setVisibleCount(prev => prev + 4);
  };

  return (
    <>
      <Header loginState="login" />
      <div className="container py-4">
        {/* 메인 타이틀 */}
        <h2 className="mb-4 fw-bold" style={{ fontSize: "2rem" }}>모임 가입 게시판</h2>

        {/* 카테고리 선택 + 글쓰기 버튼 */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="btn btn-sm rounded-pill"
                style={{
                  backgroundColor: selectedCategory === cat ? "#F9B4ED" : "#ffffff",
                  color: selectedCategory === cat ? "#ffffff" : "#F9B4ED",
                  border: selectedCategory === cat ? "none" : "1px solid #F9B4ED",
                  padding: "0.5rem 1rem",
                  fontSize: "0.95rem"
                }}
                onClick={() => handleCategoryClick(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <Link
            to="/join/board/write"
            className="btn btn-outline-primary btn-sm"
            style={{ padding: "0.5rem 1rem", fontSize: "0.95rem" }}>
            게시글 작성
          </Link>
        </div>

        {/* 게시글 목록 */}
        <div className="row">
          {boardList.length === 0 && (
            <p className="text-muted text-center mt-5" style={{ fontSize: "1rem" }}>
              게시글이 없습니다.
            </p>
          )}
          {boardList.slice(0, visibleCount).map((board) => (
            <div key={board.boardNo} className="col-md-6 mb-4">
              <Link
                to={`/join/board/detail/${board.boardNo}`}
                className="text-decoration-none text-dark">
                <div className="card shadow-sm h-100">
                  <div className="card-body" style={{ padding: "1.5rem" }}>
                    {/* 작성자 */}
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={board.boardWriterProfileUrl || "/images/default-profile.png"}
                        alt="프로필"
                        className="rounded-circle me-3"
                        style={{ width: "3rem", height: "3rem", objectFit: "cover" }}/>
                      <div>
                        <strong>{board.boardWriterNickname}</strong>
                        <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                          {board.boardWriterGender === "M" ? "남성" : "여성"} · {board.boardWriterBirth} · {board.boardWriterMbti}
                        </div>
                      </div>
                    </div>

                    {/* 카테고리 */}
                    <div
                      className="mb-2"
                      style={{ color: "#DABFFF", fontWeight: "bold", fontSize: "0.9rem" }}>
                      {board.boardCategory}
                    </div>

                    {/* 제목 */}
                    <h5 className="fw-bold mb-2" style={{ fontSize: "1.2rem" }}>
                      {board.boardTitle}
                    </h5>

                    {/* 내용 일부 출력 */}
                    <p
                      className="text-truncate mb-2"
                      style={{ fontSize: "0.95rem", maxWidth: "100%" }}>
                      {board.boardContent?.length > 20
                        ? board.boardContent.slice(0, 20) + "..."
                        : board.boardContent}
                    </p>

                    {/* 작성일 + 댓글 수 */}
                    <small className="text-muted">
                      {board.formattedWriteTime} / 댓글 {board.boardReply}
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
              style={{ padding: "0.6rem 2rem", fontSize: "1rem" }}>
              더보기
            </button>
          </div>
        )}
      </div>
    </>
  );
}
