import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { useRecoilValue } from "recoil";
import { replyCountState } from "../store/replyCountState";
import { loginState, userNoState, windowWidthState } from "../utils/storage";
import { FaRegCommentDots } from "react-icons/fa";
import ProfilePopover from "../components/ProfilePopover";
import changeIcon from "../utils/changeIcon";

export default function JoinBoard() {
  const categories = [
    "전체",
    "스포츠",
    "사교",
    "독서",
    "여행",
    "음악",
    "게임",
    "공연",
    "자기계발",
    "요리",
  ];
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [boardList, setBoardList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [showPopoverId, setShowPopoverId] = useState(null);

  const windowWidth = useRecoilValue(windowWidthState);
  const replyCounts = useRecoilValue(replyCountState);
  const login = useRecoilValue(loginState);
  const userNo = useRecoilValue(userNoState);

  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const res = await axios.get(`/board/joinboard`, {
          params:
            selectedCategory !== "전체" ? { category: selectedCategory } : {},
        });
        setBoardList(res.data);
      } catch (err) {
        console.error("게시글 불러오기 에러:", err);
      }
    };
    fetchBoardList();
  }, [selectedCategory, userNo]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <>
      <Header loginState={`${login ? "loggined" : "login"}`} input={false} />
      <div
        className="vh-100"
        style={{
          paddingTop: "70px",
          paddingBottom: "2rem",
          paddingLeft: "8.33%",
          paddingRight: "8.33%",
        }}
      >
        <div className="mb-5">
          <h2
            className="fw-bold"
            style={{ fontSize: "2rem", marginTop: "80px" }}
          >
            모임 가입 게시판
          </h2>
        </div>

        <div
          className={`d-flex ${
            windowWidth > 768
              ? "justify-content-between"
              : "flex-column align-items-end"
          } mb-4 flex-wrap ${windowWidth > 768 ? "gap-2" : "gap-5"}`}
        >
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className="btn btn-sm rounded-pill"
                style={{
                  backgroundColor:
                    selectedCategory === cat ? "#000000" : "#f1f3f5",
                  color: selectedCategory === cat ? "#ffffff" : "#000000",
                  border: "none",
                  padding: "0.5rem 1rem",
                  fontSize: "0.95rem",
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <Link
            to="/join/board/write"
            className="btn btn-outline-primary btn-sm"
            style={{ padding: "0.5rem 1rem", fontSize: "0.95rem" }}
          >
            게시글 작성
          </Link>
        </div>

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
                to={`/join/board/detail/${board.boardNo}`}
                className="text-decoration-none text-dark"
              >
                <div
                  className="card shadow-sm h-100"
                  style={{ backgroundColor: "#f1f3f5", border: "none" }}
                >
                  <div className="card-body" style={{ padding: "1.5rem" }}>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={`${
                          import.meta.env.VITE_AJAX_BASE_URL
                        }/member/image/${board.boardWriter}`}
                        alt="프로필"
                        className="rounded-circle me-3"
                        style={{
                          width: "3rem",
                          height: "3rem",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPopoverId(
                            board.boardNo === showPopoverId
                              ? null
                              : board.boardNo
                          );
                        }}
                      />
                      <div>
                        <strong>
                          {board.boardWriterNickname || "알 수 없음"}
                        </strong>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {board.boardWriterGender === "m" ? "남성" : "여성"} ·{" "}
                          {board.boardWriterBirth} · {board.boardWriterMbti}
                        </div>
                      </div>
                    </div>
                    <div
                      className="d-inline-flex bg-light align-items-center gap-2 mb-3"
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
                      {changeIcon(board.boardCategory)}
                      {board.boardCategory}
                    </div>
                    <h5 className="fw-bold mb-3" style={{ fontSize: "1.2rem" }}>
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
                    <div
                      className="d-flex align-items-center gap-3"
                      style={{ color: "#666666" }}
                    >
                      {board.boardWriteTime
                        ? new Date(board.boardWriteTime).toLocaleString(
                            "ko-KR",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "시간 정보 없음"}{" "}
                      <div className="d-flex align-items-center gap-1">
                        <FaRegCommentDots />{" "}
                        <span>
                          댓글 {replyCounts[board.boardNo] ?? board.boardReply}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              {showPopoverId === board.boardNo && (
                <ProfilePopover
                  memberNo={board.boardWriter}
                  onClose={() => setShowPopoverId(null)}
                />
              )}
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
