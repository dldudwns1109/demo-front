import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import { replyCountState } from "../store/replyCountState";
import { loginState, locationState, userNoState } from "../utils/storage";
import Header from "../components/Header";
import CrewTopNav from "../components/CrewTopNav";
import { FaRegCommentDots } from "react-icons/fa";

export default function CrewBoard() {
  const { crewNo } = useParams();
  const [crewName, setCrewName] = useState("");
  const categories = ["전체", "공지", "후기", "자유"];
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [boardList, setBoardList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isMember, setIsMember] = useState(false);

  const replyCounts = useRecoilValue(replyCountState);

  // 로그인 및 위치 상태
  const login = useRecoilValue(loginState);
  const [location, setLocation] = useRecoilState(locationState);
  const userNo = useRecoilValue(userNoState);

  const [showPopoverId, setShowPopoverId] = useState(null);
  const popoverRef = useRef();

  const [memberData, setMemberData] = useState({});

  // const getAuthHeaders = () => {
  //   const token = localStorage.getItem("refreshToken");
  //   return token ? { Authorization: `Bearer ${token.trim()}` } : {};
  // };
  const getAuthHeaders = () => {
    const token = localStorage.getItem("refreshToken");
    return { Authorization: `Bearer ${token.trim()}` };
  };

  // 모임원 여부 확인
  useEffect(() => {
    const checkMemberStatus = async () => {
      if (!login) return;

      try {
        const headers = getAuthHeaders();
        const res = await axios.get(
          `http://localhost:8080/api/crewmember/${crewNo}/member`,
          { headers }
        );
        setIsMember(res.data);
      } catch (err) {
        console.error("모임원 여부 확인 실패:", err.message);
        setIsMember(false);
      }
    };

    checkMemberStatus();
  }, [login, crewNo]);

  useEffect(() => {
    const fetchCrewName = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/crew/${crewNo}`);
        setCrewName(res.data.crewName);
      } catch (err) {
        console.error("크루 이름 불러오기 실패", err);
      }
    };
    fetchCrewName();
  }, [crewNo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/board/crew/${crewNo}`,
          {
            params:
              selectedCategory !== "전체" ? { category: selectedCategory } : {},
          }
        );
        setBoardList(res.data);
        setVisibleCount(4);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [crewNo, selectedCategory]);

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
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <>
      {/* 헤더 */}
      <Header
        loginState={`${login ? "loggined" : "login"}`}
        location={location}
        setLocation={setLocation}
      />

      <div
        className="container"
        style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
      >
        <CrewTopNav />

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
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {isMember && (
            <Link
              to={`/crew/${crewNo}/board/write`}
              className="btn btn-outline-primary btn-sm"
              style={{ padding: "0.5rem 1rem", fontSize: "0.95rem" }}
            >
              게시글 작성
            </Link>
          )}
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
              <div
                className="card shadow-sm h-100"
                style={{ backgroundColor: "#f1f3f5", border: "none" }}
              >
                <div
                  className="card-body"
                  style={{
                    padding: "1.5rem",
                    cursor: isMember ? "pointer" : "default",
                  }}
                  onClick={(e) => {
                    if (!isMember) {
                      e.preventDefault();
                      window.confirm("권한이 없습니다.");
                      return;
                    }
                    window.location.href = `/crew/${crewNo}/board/detail/${board.boardNo}`;
                  }}
                >
                  <div className="d-flex align-items-center mb-3">
                    {/* 프로필 이미지 클릭 시 팝오버 */}
                    <img
                      src={`http://localhost:8080/api/member/image/${board.boardWriter}`}
                      alt="프로필"
                      className="rounded-circle me-3"
                      style={{
                        width: "3rem",
                        height: "3rem",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // 카드 클릭과 분리
                        setShowPopoverId(
                          showPopoverId === board.boardNo ? null : board.boardNo
                        );
                      }}
                    />
                    <div>
                      <strong>{board.boardWriterNickname}</strong>

                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                          color: board.isLeader === "Y" ? "#F9B4ED" : "#888",
                          marginLeft: "0.5rem", // 간격 조정
                        }}
                      >
                        {board.isLeader === "Y" ? "회장" : "회원"}
                      </span>
                      <div
                        className="text-muted"
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        {board.boardCategory}
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

                  {/* <small className="text-muted d-flex align-items-center gap-1">
                    <FaRegCommentDots /> 댓글 {replyCounts[board.boardNo] ?? 0}
                  </small> */}
                  <small className="text-muted d-flex align-items-center gap-1">
                    {board.boardWriteTime
                      ? new Date(board.boardWriteTime).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "시간 정보 없음"}
                    / <FaRegCommentDots style={{ marginBottom: "2px" }} />
                    댓글 {replyCounts[board.boardNo] ?? board.boardReply}
                  </small>
                </div>
              </div>

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
                    border: "1px solid #ddd",
                  }}
                >
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={`http://localhost:8080/api/member/image/${userNo}`}
                      alt="프로필"
                      className="rounded-circle me-3"
                      style={{
                        width: "3.5rem",
                        height: "3.5rem",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div className="fw-bold">{board.boardWriterNickname}</div>
                      <div className="badge bg-info text-white me-1">
                        {board.boardWriterMbti || "MBTI"}
                      </div>
                    </div>
                  </div>
                  <div className="text-muted mb-2">
                    {board.boardWriterLocation} · {board.boardWriterSchool} ·{" "}
                    {board.boardWriterBirth}
                  </div>
                  <hr />
                  <div className="fw-bold">가입한 모임 예시</div>
                  <div className="d-flex align-items-center mt-2">
                    <img
                      src="/images/sample-group.jpg"
                      className="me-2 rounded"
                      style={{ width: "2rem", height: "2rem" }}
                      alt="모임"
                    />
                    <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                      모임 이름
                    </div>
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
