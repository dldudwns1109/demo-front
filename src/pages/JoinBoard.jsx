import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { useRecoilValue, useRecoilState } from "recoil";
import { replyCountState } from "../store/replyCountState";
import { loginState, locationState, userNoState } from "../utils/storage";
import GroupItem from "../components/GroupItem";
import { FaRegCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
    "자기개발",
    "요리",
  ];
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [boardList, setBoardList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const replyCounts = useRecoilValue(replyCountState);
  //로그인 관련
  const login = useRecoilValue(loginState);
  const userNo = useRecoilValue(userNoState);
  const [location, setLocation] = useRecoilState(locationState);

  // 팝오버 관련 상태 추가
  const [showPopoverId, setShowPopoverId] = useState(null);
  const popoverRef = useRef();

  //팝오버 관리
  const [activeTab, setActiveTab] = useState("join");
  const [joinList, setJoinList] = useState([]);

  // 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/member/profile/${board.boardWriter}`
        );
        setProfile(res.data);
      } catch (err) {
        console.error("프로필 불러오기 에러:", err);
      }
    };

    fetchProfile();
  }, [userNo]);

  // 게시글 목록 불러오기
  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/board/joinboard",
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
  }, [selectedCategory]);

  // 팝오버 외부 클릭 감지해서 닫기
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (popoverRef.current && !popoverRef.current.contains(e.target)) {
  //       setShowPopoverId(null);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

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

  useEffect(() => {
    const fetchJoinAndCreateList = async () => {
      try {
        if (userNo) {
          const joinRes = await axios.get(
            `http://localhost:8080/api/crew/findJoinedGroup/${userNo}`
          );
          const createRes = await axios.get(
            `http://localhost:8080/api/crew/findCreatedGroup/${userNo}`
          );
          const joinData = Array.isArray(joinRes.data) ? joinRes.data : [];
          const createData = Array.isArray(createRes.data)
            ? createRes.data
            : [];

          const mergedList = [...joinData, ...createData];
          setJoinList(mergedList);
        } else {
          // 비회원일 경우, 전체 모임 목록만 가져오기
          const res = await axios.get(`http://localhost:8080/api/crew/all`);
          setJoinList(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("모임 목록 불러오기 에러:", err);
      }
    };

    fetchJoinAndCreateList();
  }, [userNo]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
  };

  return (
    <>
      <Header
        loginState={`${login ? "loggined" : "login"}`}
        location={location}
        setLocation={setLocation}
      />
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
                  style={{
                    backgroundColor: "rgb(241, 243, 245)",
                    border: "none",
                  }}
                >
                  <div className="card-body" style={{ padding: "1.5rem" }}>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        // src={
                        //   profile
                        //     ? `http://localhost:8080/api/member/image/${userNo}`
                        //     : "/images/default-profile.png"
                        // }
                        src={
                          // board.boardWriterProfileUrl !== 0
                          //   ? `http://localhost:8080/api/member/image/${board.boardWriterProfileUrl}`
                          //   : "/images/default-profile.png"
                          board.boardWriterProfileUrl !== 0
                            ? `http://localhost:8080/api/board/image/${board.boardWriterProfileUrl}`
                            : "/images/default-profile.png"
                        }
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
                          {board.boardWriterGender} · {board.boardWriterBirth} ·{" "}
                          {board.boardWriterMbti}
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
                      / <FaRegCommentDots style={{ marginBottom: "2px" }} />
                      댓글 {replyCounts[board.boardNo] ?? board.boardReply}
                    </small>
                  </div>
                </div>
              </Link>

              {/* 팝오버 */}
              {showPopoverId === board.boardNo && (
                <div
                  // ref={popoverRef}
                  // className="shadow position-absolute bg-white rounded p-3"
                  // style={{
                  //   top: "5rem",
                  //   left: "1rem",
                  //   zIndex: 10,
                  //   width: "300px",
                  //   fontSize: "0.9rem",
                  //   border: "1px solid #ddd",
                  // }}
                  ref={popoverRef}
                  className="shadow bg-white rounded p-3"
                  style={{
                    position: "absolute",
                    top: "4.5rem",
                    left: "0",
                    zIndex: 1000,
                    width: "300px",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={
                        profile
                          ? `http://localhost:8080/api/member/image/${userNo}`
                          : "/images/default-profile.png"
                      }
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
                  <div
                    className="text-muted mb-2"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {board.boardWriterLocation} · {board.boardWriterSchool} ·{" "}
                    {board.boardWriterBirth}
                  </div>
                  <hr />
                  {/* <div className="fw-bold">가입한 모임 예시</div>
                  <div className="d-flex align-items-center mt-2">
                    <img
                      src="/images/sample-group.jpg"
                      className="me-2 rounded"
                      style={{ width: "2rem", height: "2rem" }}
                    />
                    <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                      모임 이름
                    </div>
                  </div> */}

                  <div className="fw-bold mb-3 text-center">가입한 모임</div>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {joinList.length > 0 ? (
                      joinList.map((crew, idx) => (
                        <div
                          key={idx}
                          className="d-flex align-items-center mb-3 cursor-pointer"
                          onClick={() =>
                            navigate(`/crew/${crew.crewNo}/detail`)
                          }
                          style={{
                            cursor: "pointer",
                            padding: "0.5rem",
                            borderRadius: "8px",
                            transition: "background-color 0.2s",
                          }}
                        >
                          {/* 모임 이미지 */}
                          <img
                            src={
                              crew.crewImageUrl || "/images/default-group.jpg"
                            }
                            alt="모임"
                            className="rounded-circle"
                            style={{
                              width: "3rem",
                              height: "3rem",
                              objectFit: "cover",
                              marginRight: "1rem",
                            }}
                          />

                          {/* 모임 정보 */}
                          <div>
                            <div
                              className="fw-bold"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {crew.crewName}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {crew.crewCategory} · {crew.crewLocation} · 회원{" "}
                              {Array.isArray(crew.members)
                                ? crew.members.length
                                : 0}
                              명
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted text-center">
                        가입한 모임이 없습니다.
                      </div>
                    )}
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
