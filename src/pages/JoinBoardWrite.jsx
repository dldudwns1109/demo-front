import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { FaPaperPlane } from "react-icons/fa";

export default function JoinBoardWrite() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const categories = [
    "스포츠", "사교", "독서", "여행", "음악", "게임", "공연", "자기개발", "요리"
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/profile");
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        // 로그인 안 되어 있으면 그냥 profile 없음 처리
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCategory || !boardTitle.trim() || !boardContent.trim()) {
      alert("카테고리, 제목, 글 내용을 모두 입력해주세요.");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/board", {
        boardCategory: selectedCategory,
        boardTitle,
        boardContent,
      });
      alert("게시글이 작성되었습니다.");
      navigate("/join/board");
    } catch (err) {
      console.error(err);
      alert("게시글 작성에 실패했습니다.");
    }
  };

  return (
    <>
      <Header loginState="login" />
      <div className="container py-4">
        {/* 프로필 영역 */}
        {profile && (
          <div className="d-flex align-items-center mb-4">
            <img
              src={profile.boardWriterProfileUrl || "/images/default-profile.png"}
              alt="프로필"
              className="rounded-circle me-3"
              style={{
                width: "3rem",
                height: "3rem",
                objectFit: "cover"
              }}/>
            <div>
              <strong>{profile.boardWriterNickname}</strong>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                {profile.boardWriterGender === "M" ? "남성" : "여성"} · {profile.boardWriterBirth} · {profile.boardWriterMbti}
              </div>
            </div>
          </div>
        )}

        {/* 카테고리 선택 */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm rounded-pill px-3 ${selectedCategory === cat ? "text-white" : "text-pink-400"}`}
              style={{
                backgroundColor: selectedCategory === cat ? "#F9B4ED" : "#ffffff",
                border: selectedCategory === cat ? "none" : "1px solid #F9B4ED",
                fontSize: "0.95rem"
              }}
              onClick={() => setSelectedCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* 제목 입력 */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="제목을 입력하세요"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            style={{ fontSize: "1rem", padding: "0.75rem" }}/>
        </div>

        {/* 내용 입력 */}
        <div className="mb-4">
          <textarea
            className="form-control"
            rows="8"
            placeholder="글 내용을 입력하세요"
            value={boardContent}
            onChange={(e) => setBoardContent(e.target.value)}
            style={{ fontSize: "1rem", padding: "1rem" }}></textarea>
        </div>

        {/* 작성 버튼 */}
        <div className="text-center">
          <button 
            className="btn btn-primary px-5 py-2"
            onClick={handleSubmit}
            style={{ fontSize: "1rem" }}>
            작성하기
          </button>
        </div>
      </div>
    </>
  );
}
