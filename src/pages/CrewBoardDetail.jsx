import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { FaPaperPlane } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import { replyCountState } from "../store/replyCountState";
import { loginState, locationState, userNoState } from "../utils/storage";
import Header from "../components/Header";
import CrewTopNav from "../components/CrewTopNav";
import Unauthorized from "../components/Unauthorized";

export default function CrewBoardDetail() {
  const { boardNo, crewNo } = useParams();
  const [board, setBoard] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeader, setIsLeader] = useState(false);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [boardDropdownOpen, setBoardDropdownOpen] = useState(false);
  const [showBoardWriterPopover, setShowBoardWriterPopover] = useState(false);
  const [replyPopoverIndex, setReplyPopoverIndex] = useState(null);
  const boardPopoverRef = useRef();
  const replyPopoverRefs = useRef([]);
  const navigate = useNavigate();
  const [replyCounts, setReplyCounts] = useRecoilState(replyCountState);
  const boardDropdownRef = useRef(null);

  const login = useRecoilValue(loginState);
  const [location, setLocation] = useRecoilState(locationState);
  const userNo = useRecoilValue(userNoState);

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
          `/crewmember/${crewNo}/member`,
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

  /** 리더 여부 확인 */
  useEffect(() => {
    const checkLeaderStatus = async () => {
      if (!userNo || !crewNo) return;

      try {
        const res = await axios.get(
          `/board/leader/${userNo}/${crewNo}`
        );
        setIsLeader(res.data);
      } catch (err) {
        console.error("리더 여부 확인 실패:", err);
        setIsLeader(false);
      }
    };

    checkLeaderStatus();
  }, [userNo, crewNo]);

  
  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const res = await axios.get(
          `/board/${boardNo}`
        );
        if (res.data) {
          setBoard({
            ...res.data,
            isLeader: res.data.isLeader ?? "N", // isLeader 필드가 없을 경우 "N"으로 기본값 설정
          });
        } else {
          console.warn(`게시글 ${boardNo}이(가) 존재하지 않습니다.`);
          setBoard(null);
        }
      } catch (err) {
        console.error("게시글 데이터 불러오기 실패:", err.message);
        setBoard(null);
      }
    };

    fetchBoardData();
  }, [boardNo]);

  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (
  //       boardPopoverRef.current &&
  //       !boardPopoverRef.current.contains(e.target)
  //     ) {
  //       setShowBoardWriterPopover(false);
  //     }
  //     if (
  //       !replyPopoverRefs.current.some((ref) => ref && ref.contains(e.target))
  //     ) {
  //       setReplyPopoverIndex(null);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     // 게시글 작성자 팝오버 외부 클릭 시 닫힘
  //     if (
  //       boardPopoverRef.current &&
  //       !boardPopoverRef.current.contains(e.target)
  //     ) {
  //       setShowBoardWriterPopover(false);
  //     }

  //     // 게시글 드롭다운 외부 클릭 시 닫힘
  //     if (
  //       boardDropdownOpen &&
  //       boardDropdownRef.current &&
  //       !boardDropdownRef.current.contains(e.target)
  //     ) {
  //       setBoardDropdownOpen(false);
  //     }

  //     // 댓글 드롭다운 외부 클릭 시 닫힘
  //     let isReplyDropdownClicked = false;
  //     replyPopoverRefs.current.forEach((ref) => {
  //       if (ref && ref.contains(e.target)) {
  //         isReplyDropdownClicked = true;
  //       }
  //     });

  //     if (!isReplyDropdownClicked) {
  //       setDropdownOpen(null);
  //       setReplyPopoverIndex(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [boardDropdownOpen, dropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isReplyDropdownClicked = replyPopoverRefs.current.some(
        (ref) => ref && ref.contains(e.target)
      );

      // 게시글 드롭다운 외부 클릭 시 닫힘
      if (
        boardDropdownOpen &&
        boardDropdownRef.current &&
        !boardDropdownRef.current.contains(e.target)
      ) {
        setBoardDropdownOpen(false);
      }

      // 댓글 드롭다운 외부 클릭 시 닫힘
      if (!isReplyDropdownClicked) {
        setDropdownOpen(null);
        setReplyPopoverIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [boardDropdownOpen, dropdownOpen]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await axios.get(
          `/reply/${boardNo}`
        );
        setReplies(res.data);
      } catch (err) {
        console.error("댓글 목록 불러오기 에러:", err.message);
      }
    };

    fetchReplies();
  }, [boardNo]);

  const handleReplySubmit = async () => {
    if (!newReply.trim()) return;

    try {
      const replyData = {
        replyWriter: userNo,
        replyOrigin: parseInt(boardNo),
        replyContent: newReply.trim(),
        crewNo: parseInt(crewNo),
      };

      const res = await axios.post(
        `/reply`,
        replyData
      );
      setReplies([res.data, ...replies]);

      setReplyCounts((prev) => ({
        ...prev,
        [boardNo]: (prev[boardNo] ?? 0) + 1,
      }));
      setNewReply("");
    } catch (err) {
      console.error("댓글 작성 에러:", err);
    }
  };

  // const handleEditReply = (idx) => {
  //   const replyWriter = replies[idx].replyWriter;

  //   if (replyWriter !== userNo) {
  //     window.confirm("수정 권한이 없습니다.");
  //     setDropdownOpen(null);
  //     return;
  //   }

  //   const updatedReplies = [...replies];
  //   updatedReplies[idx].isEditing = true;
  //   updatedReplies[idx].previousContent = updatedReplies[idx].replyContent;
  //   setReplies(updatedReplies);
  //   setDropdownOpen(null);
  // };
  const handleEditReply = (idx) => {
    const replyWriter = replies[idx].replyWriter;

    if (replyWriter !== userNo) {
      alert("수정 권한이 없습니다.");
      setDropdownOpen(null);
      return;
    }

    const updatedReplies = [...replies];

    // 기존 내용 백업
    updatedReplies[idx] = {
      ...updatedReplies[idx],
      isEditing: true,
      backupContent: updatedReplies[idx].replyContent,
    };

    setReplies(updatedReplies);

    setDropdownOpen(null);
  };

  const handleUpdateReply = async (replyNo, idx, newContent) => {
    if (!newContent.trim()) return;

    try {
      const response = await axios.put(
        `/reply/${replyNo}`,
        { replyContent: newContent }
      );

      if (response.data) {
        const updatedReplies = replies.map((reply) =>
          reply.replyNo === replyNo
            ? {
                ...reply,
                replyContent: newContent,
                replyWtime: new Date().toISOString(),
                isEditing: false,
              }
            : reply
        );

        updatedReplies.sort(
          (a, b) => new Date(b.replyWtime) - new Date(a.replyWtime)
        );

        setReplies(updatedReplies);
      }
    } catch (err) {
      console.error("댓글 수정 에러:", err);
    }
  };

  // const handleCancelEdit = (idx) => {
  //   const updatedReplies = [...replies];
  //   updatedReplies[idx].isEditing = false;
  //   updatedReplies[idx].replyContent = updatedReplies[idx].backupContent; // 백업된 내용으로 복구
  //   delete updatedReplies[idx].backupContent; // 백업 제거
  //   setReplies(updatedReplies);
  //   setDropdownOpen(null);
  // };
  const handleCancelEdit = (idx) => {
    const updatedReplies = [...replies];

    // backupContent를 원본으로 복구
    updatedReplies[idx] = {
      ...updatedReplies[idx],
      isEditing: false,
      replyContent: updatedReplies[idx].backupContent,
    };

    delete updatedReplies[idx].backupContent; // 백업 데이터 제거
    setReplies(updatedReplies);
  };

  const handleKeyPress = (e, replyNo = null, idx = null) => {
    const newContent = e.target.value;

    if (e.key === "Enter") {
      if (replyNo === null && idx === null) {
        // 댓글 작성 시
        handleReplySubmit();
      } else {
        // 댓글 수정 시
        handleUpdateReply(replyNo, idx, newContent);
      }
    } else if (e.key === "Escape" && idx !== null) {
      handleCancelEdit(idx);
    }
  };


  const handleDeleteReply = async (replyNo, idx) => {
    const replyWriter = replies[idx].replyWriter;

    if (!userNo || (replyWriter !== userNo && board.boardWriter !== userNo)) {
      window.confirm("삭제 권한이 없습니다.");
      setDropdownOpen(null);
      return;
    }

    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (!confirmDelete) {
      setDropdownOpen(null);
      return;
    }

    try {
      await axios.delete(`/reply/${replyNo}`, {
        params: { replyOrigin: boardNo, userNo: userNo },
      });

      const updatedReplies = replies.filter((_, i) => i !== idx);
      setReplies(updatedReplies);

      // 서버로부터 최신 댓글 수를 받아와서 업데이트
      const res = await axios.get(
        `/reply/count/${boardNo}`
      );
      const updatedCount = res.data;

      setReplyCounts((prev) => ({
        ...prev,
        [boardNo]: updatedCount,
      }));

      // 강제 새로고침
      window.location.reload();
    } catch (err) {
      console.error("댓글 삭제 에러:", err);
    }
  };

  const toggleDropdown = (idx) => {
    setDropdownOpen(dropdownOpen === idx ? null : idx);
  };

  const toggleBoardDropdown = () => {
    setBoardDropdownOpen(!boardDropdownOpen);
  };

  const handleBoardEdit = () => {
    navigate(`/crew/${crewNo}/board/edit/${boardNo}`);
  };

  const handleBoardDelete = async () => {
    // 삭제 권한 확인: 작성자 또는 리더만 가능
    if (board.boardWriter !== userNo && !isLeader) {
      window.confirm("삭제 권한이 없습니다.");
      setBoardDropdownOpen(false);
      return;
    }

    const confirmDelete = window.confirm("이 게시글을 삭제하시겠습니까?");
    setBoardDropdownOpen(false);
    if (!confirmDelete) return;

    try {
      await axios.delete(`/board/${boardNo}`);
      window.confirm("게시글이 삭제되었습니다.");
      navigate(`/crew/${crewNo}/board`);
    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      window.confirm("게시글 삭제에 실패했습니다.");
    }
  };

  const handleBoardReturn = () => {
    navigate(`/crew/${crewNo}/board`);
    window.location.reload();
  };

  if (!isMember || board === null) {
    return <Unauthorized />;
  }

  return (
    <>
      <Header loginState={`${login ? "loggined" : "login"}`} input={false} />
      <div
        className="container"
        style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
      >
        <CrewTopNav />

        <div className="mb-4">
          {/* <Link
            to={`/crew/${crewNo}/board`}
            className="btn btn-outline-secondary btn-sm mt-4"
          >
            목록으로
          </Link> */}
          <button
            className="btn btn-outline-secondary btn-sm mt-4"
            onClick={handleBoardReturn}
          >
            목록으로
          </button>
        </div>

        <div className="d-flex justify-content-between align-items-start mb-4 position-relative">
          <div className="d-flex align-items-center">
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
              onClick={() => setShowBoardWriterPopover(!showBoardWriterPopover)}
            />
            {/* <div>
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
                {board.boardCategory} · {new Date(board.boardWriteTime).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </div>
            </div> */}
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
                {board.boardCategory} ·{" "}
                {new Date(board.boardWriteTime).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          <div className="position-relative" ref={boardDropdownRef}>
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
                  src="${import.meta.env.VITE_AJAX_BASE_URL}/images/sample-group.jpg"
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
                key={reply.replyNo}
                className="d-flex align-items-start border-bottom py-3 position-relative"
                style={{ fontSize: "0.95rem" }}
              >
                <img
                  src={`/attachment/${reply.profileUrl}`}
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
                  <div className="fw-bold">{reply.memberNickname}</div>
                  <div className="d-flex align-items-center">
                    {reply.isEditing ? (
                      <input
                        type="text"
                        className="form-control form-control-sm border"
                        defaultValue={reply.replyContent}
                        onBlur={(e) =>
                          handleUpdateReply(reply.replyNo, idx, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateReply(
                              reply.replyNo,
                              idx,
                              e.target.value
                            );
                          } else if (e.key === "Escape") {
                            handleCancelEdit(idx);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <div>{reply.replyContent}</div>
                    )}
                    <small
                      className="text-muted ms-3"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {new Date(reply.replyWtime).toLocaleString("ko-KR", {
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
                      ref={(el) => (replyPopoverRefs.current[idx] = el)}
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
                          onClick={() => handleDeleteReply(reply.replyNo, idx)}
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
            // onKeyDown={handleKeyPress}
            onKeyDown={(e) => handleKeyPress(e)}
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
