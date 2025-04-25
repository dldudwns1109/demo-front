import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function JoinBoard() {
  //state
  const categories = [
    "전체",
    "스포츠",
    "사교",
    "독서",
    "여행",
    "음악",
    "게임",
    "공연",
    "자기개발",
    "요리",
  ];
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [boardList, setBoardList] = useState([]);

  //effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/board", {
          params:
            selectedCategory !== "전체" ? { category: selectedCategory } : {},
        });
        setBoardList(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [selectedCategory]);

  //프로필 모달
  // useEffect(() => {
  //   const handler = (e) => {
  //     const nickname = e.detail;
  //     // 여기서 모달 띄우는 처리
  //     console.log("모달 열기!", nickname);
  //   };
  
  //   window.addEventListener("open-profile-modal", handler);
  //   return () => window.removeEventListener("open-profile-modal", handler);
  // }, []);

  //카테고리 필터 핸들링
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
  };

  //view
  return (
    <>
      <div className="container py-4">
        {/* 타이틀 */}
        <h2 className="mb-4 fw-bold">모임 가입 게시판</h2>

        {/* 카테고리 필터 + 글쓰기 버튼 */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm rounded-pill px-3 border-0`}
                style={{
                  backgroundColor:
                    selectedCategory === cat ? "#F9B4ED" : "#ffffff",
                  color: selectedCategory === cat ? "white" : "#F9B4ED",
                  border:
                    selectedCategory === cat ? "none" : "1px solid #F9B4ED",
                }}
                onClick={() => handleCategoryClick(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <Link
            to="/join/board/write"
            className="btn btn-outline-primary btn-sm">
            게시글 작성
          </Link>
        </div>

        {/* 게시글 카드 목록 */}
        <div className="row">
          {boardList.length === 0 && (
            <p className="text-muted text-center mt-5">게시글이 없습니다.</p>
          )}
          {boardList.map((board) => (
            <div key={board.boardNo} className="col-md-6 mb-4">
              <Link
                to={`/join/board/detail/${board.boardNo}`}
                className="text-decoration-none text-dark"
              >
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    {/* 작성자 정보 */}
                    <div className="d-flex align-items-center mb-2">
                      <img
                        src={
                          board.boardWriterProfileUrl ||
                          "/images/default-profile.png"
                        }
                        alt="프로필"
                        className="rounded-circle me-3"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.preventDefault(); // 링크 이동 막기
                          const openEvent = new CustomEvent(
                            "open-profile-modal",
                            { detail: board.boardWriterNickname }
                          );
                          window.dispatchEvent(openEvent);
                        }}/>

                      <div>
                        <strong>{board.boardWriterNickname}</strong>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.85rem" }}>
                          {board.boardWriterGender === "M" ? "남성" : "여성"} ·{" "}
                          {board.boardWriterBirth} · {board.boardWriterMbti}
                        </div>
                      </div>
                    </div>

                    {/* 카테고리명 강조 표시 */}
                    <div
                      className="mb-1"
                      style={{
                        color: "#DABFFF",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}>
                      {board.boardCategory}
                    </div>

                    {/* 제목 */}
                    <h5 className="fw-bold mb-2">{board.boardTitle}</h5>

                    {/* 본문 일부 출력 (최대 1줄, 20자) */}
                    <p
                      className="text-truncate mb-2"
                      style={{ fontSize: "0.9rem", maxWidth: "100%" }}>
                      {board.boardContent?.length > 20
                        ? board.boardContent.slice(0, 20) + "..."
                        : board.boardContent}
                    </p>

                    {/* 작성일 + 댓글 */}
                    <small className="text-muted">
                      {board.formattedWriteTime} / 댓글 {board.boardReply}
                    </small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
