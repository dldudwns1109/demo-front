import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { useRecoilValue, useRecoilState } from "recoil";
import { replyCountState } from "../store/replyCountState";
import { loginState, locationState, userNoState } from "../utils/storage";
import { FaRegCommentDots } from "react-icons/fa";
import ProfilePopover from "../components/ProfilePopover";

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

  const navigate = useNavigate();
  const { crewNo } = useParams();
  const replyCounts = useRecoilValue(replyCountState);
  const login = useRecoilValue(loginState);
  const userNo = useRecoilValue(userNoState);
  const [location, setLocation] = useRecoilState(locationState);

  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const res = await axios.get(
          `/board/joinboard`,
          {
            params:
              selectedCategory !== "전체" ? { category: selectedCategory } : {},
          }
        );
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
        className="container"
        style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
      >
        <div className="mb-5">
          <h2
            className="fw-bold"
            style={{ fontSize: "2rem", marginTop: "3rem" }}
          >
            모임 가입 게시판
          </h2>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
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
                        src={`${import.meta.env.VITE_AJAX_BASE_URL}/member/image/${board.boardWriter}`}
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
                      className="mb-2"
                      style={{
                        color: "#DABFFF",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    >
                      {board.boardCategory}
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
                    <small className="text-muted d-flex align-items-center gap-1">
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
                        : "시간 정보 없음"}
                      / <FaRegCommentDots style={{ marginBottom: "2px" }} />{" "}
                      댓글 {replyCounts[board.boardNo] ?? board.boardReply}
                    </small>
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
