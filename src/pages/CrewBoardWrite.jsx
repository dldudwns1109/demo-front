import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import { useRecoilState, useRecoilValue } from "recoil";
import { locationState, loginState, userNoState } from "../utils/storage";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CrewBoardWrite() {
  const { crewNo } = useParams();
  const [location, setLocation] = useRecoilState(locationState);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [profile, setProfile] = useState(null);
  const [isMember, setIsMember] = useState(false);

  const navigate = useNavigate();

  // 로그인 및 회원번호
  const login = useRecoilValue(loginState);
  const userNo = useRecoilValue(userNoState);

  const categories = ["공지", "후기", "자유"];

  const getAuthHeaders = () => {
    const token = localStorage.getItem("refreshToken");
    return token ? { Authorization: `Bearer ${token.trim()}` } : {};
  };

  // 모임원 여부 확인
  useEffect(() => {
    const checkMemberStatus = async () => {
      if (!login || !userNo) {
        alert("모임원만 접근할 수 있는 페이지입니다");
        navigate(`/crew/${crewNo}/detail`);
        return;
      }

      try {
        const headers = getAuthHeaders();
        const res = await axios.get(
          `/crewmember/${crewNo}/member`,
          { headers }
        );
        
        if (!res.data) throw new Error("권한이 없습니다.");

        setIsMember(true);
      } catch (err) {
        console.error("모임장 여부 확인 실패:", err.message);
        alert("권한이 없습니다.");
        navigate(`/crew/${crewNo}/detail`);
      }
    };

    checkMemberStatus();
  }, [login, crewNo]);

  // 프로필 정보 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `/member/mypage/${userNo}`
        );
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (isMember) fetchProfile();
  }, [userNo, isMember]);

  const handleSubmit = async () => {
    if (!selectedCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    if (!boardTitle.trim() || !boardContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const headers = getAuthHeaders();
      await axios.post(
        "/board",
        {
          boardCrewNo: crewNo,
          boardTitle,
          boardCategory: selectedCategory,
          boardWriter: userNo,
          boardContent,
        },
        { headers }
      );

      alert("게시글이 작성되었습니다.");
      navigate(`/crew/${crewNo}/board`);
    } catch (err) {
      console.error("게시글 작성 에러:", err.message);
      alert("게시글 작성에 실패했습니다.");
    }
  };

  return (
    <>
      <Header input={false} loginState={`${login ? "loggined" : "login"}`} />
      <div
        className="container"
        style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
      >
        <div className="mb-5">
          <Link
            to={`/crew/${crewNo}/board`}
            className="btn btn-outline-secondary btn-sm"
            style={{ marginTop: "3rem" }}
          >
            목록으로
          </Link>
        </div>

        {profile && (
          <div className="d-flex align-items-center mb-4">
            <img
              src={`${import.meta.env.VITE_AJAX_BASE_URL}/member/image/${userNo}`}
              alt="프로필"
              className="rounded-circle me-3"
              style={{
                width: "3rem",
                height: "3rem",
                objectFit: "cover",
              }}
            />
            <div>
              <strong>{profile.memberNickname}</strong>
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
              className="btn btn-sm rounded-pill px-3"
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
              minHeight: "400px",
              resize: "vertical",
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
    </>
  );
}
