import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { FaPaperPlane } from "react-icons/fa";
import Header from "../components/Header";

export default function JoinBoardDetail() {
  const { boardNo } = useParams();
  const [board, setBoard] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [boardDropdownOpen, setBoardDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/board/${boardNo}`);
        setBoard(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [boardNo]);

  const handleReplySubmit = () => {
    if (newReply.trim()) {
      const reply = {
        writer: "댓글작성자", // 추후 API 연동 예정
        profileUrl: "/images/default-profile.png",
        content: newReply,
        writeTime: new Date(),
        isEditing: false,
      };
      setReplies([reply, ...replies]);
      setNewReply("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleReplySubmit();
    }
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
    setReplies(updatedReplies.sort((a, b) => new Date(b.writeTime) - new Date(a.writeTime)));
  };

  const handleDeleteReply = (idx) => {
    if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
      const updatedReplies = replies.filter((_, i) => i !== idx);
      setReplies(updatedReplies);
      setDropdownOpen(null);
    }
  };

  const handleBoardEdit = () => {
    navigate(`/join/board/edit/${boardNo}`);
  };

  const handleBoardDelete = async () => {
    if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`http://localhost:8080/api/board/${boardNo}`);
        navigate("/join/board");
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!board) return <div>로딩 중...</div>;

  return (
    <>
      <Header loginState="login" />
      <div className="container py-4">
        {/* 목록으로 돌아가기 */}
        <div className="mb-3">
          <Link to="/join/board" className="btn btn-outline-secondary btn-sm">
            목록으로
          </Link>
        </div>

        {/* 프로필 영역 + 게시글 수정/삭제 드롭다운 */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <img
              src={board.boardWriterProfileUrl || "/images/default-profile.png"}
              alt="프로필"
              className="rounded-circle me-3"
              style={{ width: "3rem", height: "3rem", objectFit: "cover" }}
            />
            <div>
              <strong>{board.boardWriterNickname}</strong>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                {board.boardWriterGender === "M" ? "남성" : "여성"} · {board.boardWriterBirth} · {board.boardWriterMbti}
              </div>
            </div>
          </div>

          {/* 게시글 수정 삭제 드롭다운 */}
          <div className="position-relative">
            <button
              className="btn btn-link p-0"
              type="button"
              onClick={toggleBoardDropdown}
              style={{ color: "#0d6efd" }}>
              <FiMoreVertical size="1.5rem" />
            </button>
            {boardDropdownOpen && (
              <ul className="dropdown-menu show" style={{ position: "absolute", right: 0 }}>
                <li><button className="dropdown-item" onClick={handleBoardEdit}>수정</button></li>
                <li><button className="dropdown-item" onClick={handleBoardDelete}>삭제</button></li>
              </ul>
            )}
          </div>
        </div>

        {/* 글 내용 */}
        <div className="mb-4">
          <div style={{ whiteSpace: "pre-wrap", fontSize: "1rem" }}>{board.boardContent}</div>
        </div>

        {/* 댓글 리스트 */}
        <div className="mb-3">
          {replies.length === 0 ? (
            <p className="text-muted">아직 댓글이 없습니다.</p>
          ) : (
            replies.map((reply, idx) => (
              <div key={idx} className="d-flex align-items-start border-bottom py-3" style={{ fontSize: "0.95rem" }}>
                <img
                  src={reply.profileUrl}
                  alt="프로필"
                  className="rounded-circle me-2"
                  style={{ width: "2.5rem", height: "2.5rem", objectFit: "cover" }}
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
                        onKeyDown={(e) => e.key === "Enter" && handleUpdateReply(idx, e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <div>{reply.content}</div>
                    )}
                    <small className="text-muted ms-3" style={{ fontSize: "0.8rem" }}>
                      {new Date(reply.writeTime).toLocaleString("ko-KR", {
                        year: "numeric", month: "2-digit", day: "2-digit",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </small>
                  </div>
                </div>
                <div className="position-relative ms-2" style={{ flexShrink: 0 }}>
                  <button
                    className="btn btn-link p-0"
                    type="button"
                    onClick={() => toggleDropdown(idx)}
                    style={{ color: "#0d6efd" }}
                  >
                    <FiMoreVertical size="1.5rem" />
                  </button>
                  {dropdownOpen === idx && (
                    <ul className="dropdown-menu show" style={{ position: "absolute", right: 0 }}>
                      <li><button className="dropdown-item" onClick={() => handleEditReply(idx)}>수정</button></li>
                      <li><button className="dropdown-item" onClick={() => handleDeleteReply(idx)}>삭제</button></li>
                    </ul>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 댓글 작성 */}
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
            style={{ top: "50%", right: "1rem", transform: "translateY(-50%)", color: "#0d6efd" }}
            onClick={handleReplySubmit}
          >
            <FaPaperPlane size="1.2rem" />
          </button>
        </div>
      </div>
    </>
  );
}
