import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

export default function JoinBoardEdit() {
  const { boardNo } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState({ boardTitle: "", boardContent: "", boardCategory: "" });
  const categories = [
    "스포츠", "사교", "독서", "여행", "음악", "게임", "공연", "자기개발", "요리"
  ];

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/board/${boardNo}`);
        setBoard({
          boardTitle: res.data.boardTitle,
          boardContent: res.data.boardContent,
          boardCategory: res.data.boardCategory
        });
      } catch (err) {
        console.error(err);
        alert("게시글 정보를 불러오는데 실패했습니다.");
        navigate("/join/board");
      }
    };
    fetchBoard();
  }, [boardNo, navigate]);

  const handleEdit = async () => {
    if (!board.boardTitle.trim() || !board.boardContent.trim() || !board.boardCategory.trim()) {
      alert("카테고리, 제목, 내용을 모두 입력해주세요.");
      return;
    }
    try {
      await axios.put(`http://localhost:8080/api/board/${boardNo}`, {
        boardTitle: board.boardTitle,
        boardContent: board.boardContent,
        boardCategory: board.boardCategory,
      });
      alert("게시글이 수정되었습니다.");
      navigate(`/join/board/detail/${boardNo}`);
    } catch (err) {
      console.error(err);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  const handleBack = () => {
    navigate(`/join/board/detail/${boardNo}`);
  };

  return (
    <>
      {/* <Header loginState="login" /> */}
      <div className="container" style={{ padding: "2rem" }}>
        {/* 목록으로 돌아가기 */}
        <div style={{ marginBottom: "2rem" }}>
          <button
            className="btn btn-outline-secondary"
            style={{ padding: "0.5rem 1.5rem" }}
            onClick={() => navigate("/join/board")}>
            목록으로
          </button>
        </div>

        {/* 카테고리 선택 */}
        <div className="d-flex flex-wrap gap-2" style={{ marginBottom: "2rem" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="btn btn-sm rounded-pill"
              style={{
                backgroundColor: board.boardCategory === cat ? "#F9B4ED" : "#ffffff",
                color: board.boardCategory === cat ? "#ffffff" : "#F9B4ED",
                border: board.boardCategory === cat ? "none" : "0.1rem solid #F9B4ED",
                padding: "0.5rem 1.2rem",
                fontSize: "0.9rem",
              }}
              onClick={() => setBoard({ ...board, boardCategory: cat })}>
              {cat}
            </button>
          ))}
        </div>

        {/* 제목 입력 */}
        <div style={{ marginBottom: "2rem" }}>
          <input
            type="text"
            className="form-control"
            placeholder="제목을 입력하세요"
            value={board.boardTitle}
            onChange={(e) => setBoard({ ...board, boardTitle: e.target.value })}
            style={{ fontSize: "1rem", padding: "0.75rem 1rem" }}/>
        </div>

        {/* 내용 입력 */}
        <div style={{ marginBottom: "2rem" }}>
          <textarea
            className="form-control"
            rows="8"
            placeholder="내용을 입력하세요"
            value={board.boardContent}
            onChange={(e) => setBoard({ ...board, boardContent: e.target.value })}
            style={{ fontSize: "1rem", padding: "0.75rem 1rem" }}></textarea>
        </div>

        {/* 버튼 영역 */}
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-primary"
            style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}
            onClick={handleEdit}>
            수정하기
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}
            onClick={handleBack}>
            뒤로가기
          </button>
        </div>
      </div>
    </>
  );
}
