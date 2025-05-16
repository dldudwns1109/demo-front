import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { FaPaperPlane } from "react-icons/fa";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { replyCountState } from "../store/replyCountState";
import { loginState, userNoState, locationState } from "../utils/storage";
import Header from "../components/Header";
import ProfilePopover from "../components/ProfilePopover";

export default function JoinBoardDetail() {
  const { boardNo } = useParams();
  const [board, setBoard] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [boardDropdownOpen, setBoardDropdownOpen] = useState(false);
  const setReplyCounts = useSetRecoilState(replyCountState);
  const [showBoardWriterPopover, setShowBoardWriterPopover] = useState(false);
  const [replyPopoverIndex, setReplyPopoverIndex] = useState(null);
  const boardPopoverRef = useRef();
  const replyPopoverRefs = useRef([]);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  //로그인 관련
  const login = useRecoilValue(loginState);
  const [location, setLocation] = useRecoilState(locationState);
  const userNo = useRecoilValue(userNoState);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get(
  //         `http://localhost:8080/api/board/${boardNo}`
  //       );
  //       setBoard(res.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchData();
  // }, [boardNo]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/board/${boardNo}`
        );
        setBoard(res.data);
      } catch (err) {
        console.error("게시글 불러오기 에러:", err);
      }
    };

    const fetchReplies = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/reply/${boardNo}`
        );
        console.log("댓글 데이터:", res.data);
        setReplies(res.data);
      } catch (err) {
        console.error("댓글 불러오기 에러:", err);
      }
    };

    fetchBoard();
    fetchReplies();
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

  // const handleReplySubmit = () => {
  //   if (newReply.trim()) {
  //     const reply = {
  //       writer: "댓글작성자", // 더미
  //       profileUrl: "/images/default-profile.png",
  //       content: newReply,
  //       writeTime: new Date(),
  //       isEditing: false,
  //       memberLocation: "서울",
  //       memberSchool: "서울대학교",
  //       memberMbti: "ENTP",
  //     };
  //     setReplies([reply, ...replies]);
  //     setNewReply("");
  //     setReplyCounts((prev) => ({
  //       ...prev,
  //       [boardNo]: (prev[boardNo] ?? board?.boardReply ?? 0) + 1,
  //     }));
  //   }
  // };

  const handleReplySubmit = async () => {
    if (!login) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!newReply.trim()) return;

    try {
      const replyData = {
        replyWriter: userNo,
        replyOrigin: parseInt(boardNo),
        replyContent: newReply.trim(),
      };

      const res = await axios.post(
        "http://localhost:8080/api/reply",
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

  // const handleDeleteReply = async (replyNo, idx) => {
  //   const replyWriter = replies[idx].replyWriter;

  //   if (replyWriter !== userNo && board.boardWriter !== userNo) {
  //     alert("삭제 권한이 없습니다.");
  //     return;
  //   }

  //   if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

  //   try {
  //     await axios.delete(`http://localhost:8080/api/reply/${replyNo}`, {
  //       params: { replyOrigin: boardNo },
  //     });

  //     setReplies(replies.filter((reply) => reply.replyNo !== replyNo));

  //     setReplies(updatedReplies);
  //     setDropdownOpen(null);

  //     setReplyCounts((prev) => ({
  //       ...prev,
  //       [boardNo]: (prev[boardNo] ?? 1) - 1,
  //     }));
  //   } catch (err) {
  //     console.error("댓글 삭제 에러:", err);
  //   }
  // };

  const handleDeleteReply = async (replyNo, idx) => {
    // 댓글 작성자 확인
    const replyWriter = replies[idx].replyWriter;

    // 삭제 권한 체크: 비회원 또는 권한 없는 사용자
    if (!userNo || (replyWriter !== userNo && board.boardWriter !== userNo)) {
      alert("삭제 권한이 없습니다.");
      setDropdownOpen(null); // 드롭다운 즉시 닫기
      return;
    }

    // 삭제 확인
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    setDropdownOpen(null); // 드롭다운 닫기

    if (!confirmDelete) return;

    try {
      // 댓글 삭제 요청
      await axios.delete(`http://localhost:8080/api/reply/${replyNo}`, {
        params: {
          replyOrigin: boardNo,
          userNo: userNo,
        },
      });

      // 삭제 후 댓글 목록 갱신
      const updatedReplies = replies.filter(
        (reply) => reply.replyNo !== replyNo
      );
      setReplies(updatedReplies);
      setDropdownOpen(null);

      setReplyCounts((prev) => ({
        ...prev,
        [boardNo]: (prev[boardNo] ?? 1) - 1,
      }));
      alert("댓글이 삭제되었습니다.");
    } catch (err) {
      console.error("댓글 삭제 에러:", err);
      alert("댓글 삭제에 실패했습니다.");
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

  // const handleEditReply = (idx) => {
  //   const updatedReplies = [...replies];
  //   updatedReplies[idx].isEditing = true;
  //   updatedReplies[idx].backupContent = updatedReplies[idx].replyContent;
  //   setReplies(updatedReplies);
  //   setDropdownOpen(null);
  // };

  const handleEditReply = (idx) => {
    const replyWriter = replies[idx].replyWriter;

    setDropdownOpen(null);

    // 댓글 작성자가 아닌 경우 수정 차단
    if (replyWriter !== userNo) {
      alert("수정 권한이 없습니다.");
      return;
    }

    const updatedReplies = [...replies];
    updatedReplies[idx].isEditing = true;
    updatedReplies[idx].backupContent = updatedReplies[idx].replyContent; // 백업 내용 저장
    setReplies(updatedReplies);
  };

  const handleCancelEdit = (idx) => {
    const updatedReplies = [...replies];
    updatedReplies[idx].isEditing = false;
    updatedReplies[idx].replyContent = updatedReplies[idx].backupContent; // 백업된 내용으로 복구
    delete updatedReplies[idx].backupContent; // 백업 제거
    setReplies(updatedReplies);
    setDropdownOpen(null);
  };

  // const handleUpdateReply = (idx, newContent) => {
  //   const updatedReplies = [...replies];
  //   updatedReplies[idx].content = newContent;
  //   updatedReplies[idx].isEditing = false;
  //   updatedReplies[idx].writeTime = new Date();
  //   setReplies(
  //     updatedReplies.sort(
  //       (a, b) => new Date(b.writeTime) - new Date(a.writeTime)
  //     )
  //   );
  // };
  const handleUpdateReply = async (replyNo, idx, newContent) => {
    if (!newContent.trim()) return;

    const replyWriter = replies[idx].replyWriter;

    setDropdownOpen(null);

    if (replyWriter !== userNo) {
      alert("수정 권한이 없습니다.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/reply/${replyNo}`,
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

  // const handleDeleteReply = (idx) => {
  //   if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
  //     const updatedReplies = replies.filter((_, i) => i !== idx);
  //     setReplies(updatedReplies);
  //     setDropdownOpen(null);
  //     setReplyCounts((prev) => ({
  //       ...prev,
  //       [boardNo]: (prev[boardNo] ?? board?.boardReply ?? 1) - 1,
  //     }));
  //   }
  // };

  const handleBoardEdit = () => {
    if (board.boardWriter !== userNo) {
      window.confirm("수정 권한이 없습니다.");
      setBoardDropdownOpen(null);
      return;
    }

    setBoardDropdownOpen(null);
    navigate(`/join/board/edit/${board.boardNo}`);
  };

  const handleBoardDelete = async () => {
    if (board.boardWriter !== userNo) {
      window.confirm("삭제 권한이 없습니다.");
      setBoardDropdownOpen(null);
      return;
    }

    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/board/${board.boardNo}`);
      alert("게시글이 삭제되었습니다.");
      navigate("/join/board");
    } catch (err) {
      console.error(err);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const handleBoardReturn = () => {
    navigate(`/join/board`);
    window.location.reload();
  };

  if (!board) return <div>로딩 중...</div>;

  return (
    <>
      <Header
        loginState={`${login ? "loggined" : "login"}`}
        // location={location}
        // setLocation={setLocation}
        input={false}
      />
      <div
        className="container"
        style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
      >
        <div className="mb-5">
          {/* <Link
            to="/join/board"
            className="btn btn-outline-secondary btn-sm"
            style={{ marginTop: "3rem" }}
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

        {/* 작성자 프로필 + 드롭다운 */}
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

          {/* 게시글 드롭다운 */}
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

          {/* 작성자 팝오버 */}
          {showBoardWriterPopover && (
            <ProfilePopover
              memberNo={board.boardWriter}
              onClose={() => setShowBoardWriterPopover(false)}
            />
          )}
        </div>

        {/* 게시글 내용 */}
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

        {/* 댓글 목록 */}
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
                  src={`http://localhost:8080/api/attachment/${reply.profileUrl}`}
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

                {/* 수정/삭제 버튼 */}
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
                          // onClick={() => handleDeleteReply(reply.replyNo)}
                          onClick={() => handleDeleteReply(reply.replyNo, idx)}
                        >
                          삭제
                        </button>
                      </li>
                    </ul>
                  )}
                </div>

                {/* 댓글 작성자 팝오버 */}
                {replyPopoverIndex === idx && (
                  <ProfilePopover
                    memberNo={board.boardWriter}
                    onClose={() => setShowBoardWriterPopover(false)}
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* 댓글 작성 폼 */}
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
