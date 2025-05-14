import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { FaPaperPlane } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import { replyCountState } from "../store/replyCountState";
import { loginState, locationState } from "../utils/storage";
import Header from "../components/Header";
import CrewTopNav from "../components/CrewTopNav";
import Unauthorized from "../components/Unauthorized";

export default function CrewBoardDetail() {
  const { boardNo, crewNo } = useParams();
  const [board, setBoard] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [boardDropdownOpen, setBoardDropdownOpen] = useState(false);
  const [setReplyCounts] = useRecoilState(replyCountState);
  const [showBoardWriterPopover, setShowBoardWriterPopover] = useState(false);
  const [replyPopoverIndex, setReplyPopoverIndex] = useState(null);
  const boardPopoverRef = useRef();
  const replyPopoverRefs = useRef([]);
  const navigate = useNavigate();

  const login = useRecoilValue(loginState);
  const [location, setLocation] = useRecoilState(locationState);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("refreshToken");
    return token ? { Authorization: `Bearer ${token.trim()}` } : {};
  };

  /* 모임원 여부 확인 */
  useEffect(() => {
    const checkMemberStatus = async () => {
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
      } finally {
        setIsLoading(false);
      }
    };

    if (login) {
      checkMemberStatus();
    } else {
      setIsLoading(false);
    }
  }, [crewNo, login]);

  /* 게시글 데이터 불러오기 (모임원만 가능) */
  // useEffect(() => {
  //   const fetchBoardData = async () => {
  //     try {
  //       const res = await axios.get(
  //         `http://localhost:8080/api/board/${boardNo}`
  //       );
  //       setBoard(res.data);
  //     } catch (err) {
  //       console.error("게시글 데이터 불러오기 실패:", err.message);
  //     }
  //   };

  //   if (isMember) {
  //     fetchBoardData();
  //   }
  // }, [boardNo, isMember]);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/board/${boardNo}`
        );
        if (res.data) {
          setBoard(res.data);
        } else {
          console.warn(`게시글 ${boardNo}이(가) 존재하지 않습니다.`);
          setBoard(null); // 명확하게 `null`로 처리
        }
      } catch (err) {
        console.error("게시글 데이터 불러오기 실패:", err.message);
        setBoard(null);
      }
    };

      fetchBoardData();
  }, [boardNo]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        boardPopoverRef.current &&
        !boardPopoverRef.current.contains(e.target)
      ) {
        setShowBoardWriterPopover(false);
      }
      if (
        !replyPopoverRefs.current.some((ref) => ref && ref.contains(e.target))
      ) {
        setReplyPopoverIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReplySubmit = () => {
    if (newReply.trim()) {
      const reply = {
        writer: "댓글작성자",
        profileUrl: "/images/default-profile.png",
        content: newReply,
        writeTime: new Date(),
        isEditing: false,
        memberLocation: "서울",
        memberSchool: "서울대학교",
        memberMbti: "ENTP",
      };
      setReplies([reply, ...replies]);
      setNewReply("");
      setReplyCounts((prev) => ({
        ...prev,
        [boardNo]: (prev[boardNo] ?? board?.boardReply ?? 0) + 1,
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleReplySubmit();
  };

  const toggleDropdown = (idx) => {
    setDropdownOpen(dropdownOpen === idx ? null : idx);
  };

  const toggleBoardDropdown = () => {
    setBoardDropdownOpen(!boardDropdownOpen);
  };

  const handleEditReply = (idx) => {
    const updatedReplies = [...replies];
    updatedReplies[idx].isEditing = true;
    setReplies(updatedReplies);
    setDropdownOpen(null);
  };

  const handleUpdateReply = (idx, newContent) => {
    const updatedReplies = [...replies];
    updatedReplies[idx].content = newContent;
    updatedReplies[idx].isEditing = false;
    updatedReplies[idx].writeTime = new Date();
    setReplies(
      [...updatedReplies].sort(
        (a, b) => new Date(b.writeTime) - new Date(a.writeTime)
      )
    );
  };

  const handleDeleteReply = (idx) => {
    if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
      const updatedReplies = replies.filter((_, i) => i !== idx);
      setReplies(updatedReplies);
      setDropdownOpen(null);
      setReplyCounts((prev) => ({
        ...prev,
        [boardNo]: (prev[boardNo] ?? board?.boardReply ?? 1) - 1,
      }));
    }
  };

  const handleBoardEdit = () => {
    navigate(`/crew/${crewNo}/board/edit/${boardNo}`);
  };

  const handleBoardDelete = async () => {
    if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`http://localhost:8080/api/board/${boardNo}`);
        navigate(`/crew/${crewNo}/board`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ paddingTop: "5rem" }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  // Unauthorized 페이지로 리다이렉트
  // if (!isMember) {
  //   return <Unauthorized />;
  // }
  if (!isMember || board === null) {
    return <Unauthorized />;
  }

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
        <CrewTopNav />

        <div className="mb-4">
          <Link
            to={`/crew/${crewNo}/board`}
            className="btn btn-outline-secondary btn-sm mt-4"
          >
            목록으로
          </Link>
        </div>

        <div className="d-flex justify-content-between align-items-start mb-4 position-relative">
          <div className="d-flex align-items-center">
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
              onClick={() => setShowBoardWriterPopover(!showBoardWriterPopover)}
            />
            <div>
              <div className="d-flex align-items-center">
                <strong className="me-2">{board.boardWriterNickname}</strong>
                <small className="text-muted">
                  {new Date(board.boardWriteTime).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                {board.boardWriterGender === "m" ? "남성" : "여성"} ·{" "}
                {board.boardWriterBirth} · {board.boardWriterMbti}
              </div>
            </div>
          </div>

          <div className="position-relative">
            <button
              className="btn btn-link p-0"
              onClick={toggleBoardDropdown}
              style={{ color: "#6C757D" }}
            >
              <FiMoreVertical size="1.5rem" />
            </button>
            {boardDropdownOpen && (
              <ul
                className="dropdown-menu show"
                style={{ position: "absolute", right: 0 }}
              >
                <li>
                  <button className="dropdown-item" onClick={handleBoardEdit}>
                    수정
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleBoardDelete}>
                    삭제
                  </button>
                </li>
              </ul>
            )}
          </div>

          {showBoardWriterPopover && (
            <div
              ref={boardPopoverRef}
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
                  src={
                    board.boardWriterProfileUrl || "/images/default-profile.png"
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

        <div className="mb-5">
          <div
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              lineHeight: "1.6",
              fontSize: "1rem",
              marginBottom: "1rem",
              padding: "1rem",
              maxWidth: "50ch",
            }}
          >
            {board.boardContent
              .split(/(?<=[.!?])\s+/) // 문장 단위로 분리 (마침표, 느낌표, 물음표 이후)
              .map((sentence, index) => (
                <p key={index} style={{ marginBottom: "0.5rem" }}>
                  {sentence.trim()}
                </p>
              ))}
          </div>
        </div>

        <hr className="my-5" />

        <h5 className="fw-bold mb-3">댓글 {replies.length}개</h5>
        <div className="mb-3">
          {replies.length === 0 ? (
            <p className="text-muted">아직 댓글이 없습니다.</p>
          ) : (
            replies.map((reply, idx) => (
              <div
                key={idx}
                className="d-flex align-items-start border-bottom py-3 position-relative"
                style={{ fontSize: "0.95rem" }}
              >
                <img
                  src={reply.profileUrl}
                  alt="프로필"
                  className="rounded-circle me-2"
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setReplyPopoverIndex(replyPopoverIndex === idx ? null : idx)
                  }
                />
                <div className="flex-grow-1">
                  <div className="fw-bold">{reply.writer}</div>
                  <div className="d-flex align-items-center">
                    {reply.isEditing ? (
                      <input
                        type="text"
                        className="form-control form-control-sm border"
                        defaultValue={reply.content}
                        onBlur={(e) => handleUpdateReply(idx, e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          handleUpdateReply(idx, e.target.value)
                        }
                        autoFocus
                      />
                    ) : (
                      <div>{reply.content}</div>
                    )}
                    <small
                      className="text-muted ms-3"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {new Date(reply.writeTime).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                </div>
                <div
                  className="position-relative ms-2"
                  style={{ flexShrink: 0 }}
                >
                  <button
                    className="btn btn-link p-0"
                    onClick={() => toggleDropdown(idx)}
                    style={{ color: "#6C757D" }}
                  >
                    <FiMoreVertical size="1.5rem" />
                  </button>
                  {dropdownOpen === idx && (
                    <ul
                      className="dropdown-menu show"
                      style={{ position: "absolute", right: 0 }}
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEditReply(idx)}
                        >
                          수정
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDeleteReply(idx)}
                        >
                          삭제
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
                {replyPopoverIndex === idx && (
                  <div
                    ref={(el) => (replyPopoverRefs.current[idx] = el)}
                    className="shadow position-absolute bg-white rounded p-3"
                    style={{
                      top: "3.5rem",
                      left: "0",
                      zIndex: 10,
                      width: "250px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <div className="fw-bold mb-2">댓글 작성자 프로필</div>
                    <div className="text-muted mb-2">
                      {reply.memberLocation} · {reply.memberSchool} ·{" "}
                      {reply.memberMbti}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="position-relative border rounded p-2">
          <input
            type="text"
            className="form-control border-0 pe-5"
            placeholder="댓글을 입력하세요"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ flex: 1, boxShadow: "none" }}
          />
          <button
            className="btn position-absolute"
            style={{
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
              color: "#6C757D",
            }}
            onClick={handleReplySubmit}
          >
            <FaPaperPlane size="1.2rem" />
          </button>
        </div>
      </div>
    </>
  );
}
