import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { useRecoilValue } from "recoil";
import { replyCountState } from "../store/replyCountState";

export default function JoinBoard() {
  const categories = [
    "전체", "스포츠", "사교", "독서", "여행", "음악", "게임", "공연", "자기개발", "요리"
  ];
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [boardList, setBoardList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

  const replyCounts = useRecoilValue(replyCountState);

  // 팝오버 관련 상태 추가
  const [showPopoverId, setShowPopoverId] = useState(null);
  const popoverRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/board", {
          params: selectedCategory !== "전체" ? { category: selectedCategory } : {},
        });
        setBoardList(res.data);
        setVisibleCount(4);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [selectedCategory]);

  // 팝오버 외부 클릭 감지해서 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowPopoverId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  return (
    <>
      {/* <Header loginState="login" /> */}
      <div className="container py-4">
        <h2 className="mb-4 fw-bold" style={{ fontSize: "2rem" }}>모임 가입 게시판</h2>

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
          <Link to="/join/board/write" className="btn btn-outline-primary btn-sm" style={{ padding: "0.5rem 1rem", fontSize: "0.95rem" }}>
            게시글 작성
          </Link>
        </div>

        <div className="row">
          {boardList.length === 0 && (
            <p className="text-muted text-center mt-5" style={{ fontSize: "1rem" }}>
              게시글이 없습니다.
            </p>
          )}
          {boardList.slice(0, visibleCount).map((board) => (
            <div key={board.boardNo} className="col-md-6 mb-4 position-relative">
              <Link to={`/join/board/detail/${board.boardNo}`} className="text-decoration-none text-dark">
                <div className="card shadow-sm h-100" style={{ backgroundColor: "rgb(241, 243, 245)", border: "none" }}>
                  <div className="card-body" style={{ padding: "1.5rem" }}>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={board.boardWriterProfileUrl || "/images/default-profile.png"}
                        alt="프로필"
                        className="rounded-circle me-3"
                        style={{ width: "3rem", height: "3rem", objectFit: "cover", cursor: "pointer" }}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPopoverId(board.boardNo === showPopoverId ? null : board.boardNo);
                        }}
                      />
                      <div>
                        <strong>{board.boardWriterNickname}</strong>
                        <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                          {board.boardWriterGender === "M" ? "남성" : "여성"} · {board.boardWriterBirth} · {board.boardWriterMbti}
                        </div>
                      </div>
                    </div>

                    <div className="mb-2" style={{ color: "#DABFFF", fontWeight: "bold", fontSize: "0.9rem" }}>
                      {board.boardCategory}
                    </div>

                    <h5 className="fw-bold mb-2" style={{ fontSize: "1.2rem" }}>
                      {board.boardTitle}
                    </h5>

                    <p className="text-truncate mb-2" style={{ fontSize: "0.95rem", maxWidth: "100%" }}>
                      {board.boardContent?.length > 20 ? board.boardContent.slice(0, 20) + "..." : board.boardContent}
                    </p>

                    <small className="text-muted">
                      {board.boardWriteTime
                        ? new Date(board.boardWriteTime).toLocaleString("ko-KR", {
                            year: "numeric", month: "2-digit", day: "2-digit",
                            hour: "2-digit", minute: "2-digit"
                          })
                        : "시간 정보 없음"} / 댓글 {replyCounts[board.boardNo] ?? board.boardReply}
                    </small>
                  </div>
                </div>
              </Link>

              {/* 팝오버 */}
              {showPopoverId === board.boardNo && (
                <div
                  ref={popoverRef}
                  className="shadow position-absolute bg-white rounded p-3"
                  style={{
                    top: "5rem",
                    left: "1rem",
                    zIndex: 10,
                    width: "300px",
                    fontSize: "0.9rem",
                    border: "1px solid #ddd"
                  }}>
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={board.boardWriterProfileUrl || "/images/default-profile.png"}
                      alt="프로필"
                      className="rounded-circle me-3"
                      style={{ width: "3.5rem", height: "3.5rem", objectFit: "cover" }}
                    />
                    <div>
                      <div className="fw-bold">{board.boardWriterNickname}</div>
                      <div className="badge bg-info text-white me-1">{board.boardWriterMbti || "MBTI"}</div>
                    </div>
                  </div>
                  <div className="text-muted mb-2">
                    {board.boardWriterLocation} · {board.boardWriterSchool} · {board.boardWriterBirth}
                  </div>
                  <hr />
                  <div className="fw-bold">가입한 모임 예시</div>
                  <div className="d-flex align-items-center mt-2">
                    <img src="/images/sample-group.jpg" className="me-2 rounded" style={{ width: "2rem", height: "2rem" }} />
                    <div className="text-muted" style={{ fontSize: "0.8rem" }}>모임 이름</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

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
