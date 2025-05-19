import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { useRecoilValue } from "recoil";
import { userNoState, loginState } from "../utils/storage";

export default function JoinBoardWrite() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // 로그인 및 회원번호
  const login = useRecoilValue(loginState);
  const userNo = useRecoilValue(userNoState);

  const categories = [
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

  // effect: 컴포넌트 마운트 시 프로필 정보 요청
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/member/mypage/${userNo}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);

        const shouldLogin = window.confirm(
          "로그인 후 이용 가능합니다. 로그인 페이지로 이동할까요?"
        );
        if (shouldLogin) {
          navigate("/signin");
        } else {
          navigate(-1);
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!selectedCategory || !boardTitle.trim() || !boardContent.trim()) {
      alert("카테고리, 제목, 글 내용을 모두 입력해주세요.");
      return;
    }
    try {
      await axios.post("/board", {
        boardCategory: selectedCategory,
        boardTitle,
        boardContent,
        boardWriter: userNo,
      });
      alert("게시글이 작성되었습니다.");
      navigate("/join/board");
    } catch (err) {
      console.error(err);
      alert("게시글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="vh-100">
      <Header loginState={`${login ? "loggined" : "login"}`} input={false} />
      <div
        style={{
          paddingTop: "70px",
          paddingLeft: "8.33%",
          paddingRight: "8.33%",
        }}
      >
        <div className="mb-5">
          <Link
            to="/join/board"
            className="btn btn-outline-secondary btn-sm"
            style={{ marginTop: "3rem" }}
          >
            목록으로
          </Link>
        </div>

        {/* --- 프로필 영역 --- */}
        {profile && (
          <div className="d-flex align-items-center mb-4">
            <img
              src={`${
                import.meta.env.VITE_AJAX_BASE_URL
              }/member/image/${userNo}`}
              alt="프로필"
              className="rounded-circle me-3"
              style={{
                width: "3rem",
                height: "3rem",
                objectFit: "cover",
              }}
            />
            <div>
              <strong>{profile.memberNickname}</strong>{" "}
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                {profile.memberGender === "m" ? "남성" : "여성"} ·{" "}
                {profile.memberBirth} · {profile.memberMbti}
              </div>
            </div>
          </div>
        )}

        {/* --- 카테고리 선택 --- */}
        <div className="d-flex flex-wrap gap-2 mb-4">
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

        {/* --- 제목 입력 --- */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="제목을 입력하세요"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            style={{ fontSize: "1rem", padding: "0.75rem" }}
          />
        </div>

        {/* --- 내용 입력 --- */}
        <div className="mb-4">
          <textarea
            className="form-control"
            rows="15"
            placeholder="글 내용을 입력하세요"
            value={boardContent}
            onChange={(e) => setBoardContent(e.target.value)}
            style={{
              fontSize: "1rem",
              padding: "1.2rem",
              minHeight: "400px", // 추가
              resize: "vertical", // 사용자가 크기 조정 가능하게
            }}
          ></textarea>
        </div>

        {/* --- 작성 버튼 --- */}
        <div className="text-center">
          <button
            className="btn btn-primary px-5 py-2"
            onClick={handleSubmit}
            style={{ fontSize: "1rem" }}
          >
            작성하기
          </button>
        </div>
      </div>
    </div>
  );
}
