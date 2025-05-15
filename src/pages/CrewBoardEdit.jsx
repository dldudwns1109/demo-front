import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { loginState, userNoState } from "../utils/storage";
import { useRecoilValue } from "recoil";

export default function CrewBoardEdit() {
  const { crewNo, boardNo } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState({
    boardTitle: "",
    boardContent: "",
    boardCategory: "",
    boardWriter: null,
  });

  const [profile, setProfile] = useState(null);
  const [isMember, setIsMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useRecoilValue(loginState);
  const userNo = useRecoilValue(userNoState);

  // CrewBoard에서 사용할 카테고리
  const crewCategories = ["공지", "후기", "자유"];

  /**
   * 1. 모임원 여부 확인
   */
  const checkMemberStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/crewmember/${crewNo}/member`
      );
      setIsMember(res.data);
    } catch (err) {
      console.error("모임원 여부 확인 실패:", err);
      setIsMember(false);
    }
  };

  /**
   * 2. 게시글 데이터 불러오기
   */
  const fetchBoardData = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/board/${boardNo}`);
      if (res.data) {
        setBoard({
          boardTitle: res.data.boardTitle,
          boardContent: res.data.boardContent,
          boardCategory: res.data.boardCategory,
          boardWriter: res.data.boardWriter,
        });
      } else {
        window.confirm("해당 게시글이 존재하지 않습니다.");
        navigate(`/crew/${crewNo}/board`);
      }
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
      navigate(`/crew/${crewNo}/board`);
    }
  };

  /**
   * 3. 권한 체크 로직
   */
  const checkPermissions = () => {
    if (!isMember || board.boardWriter !== userNo) {
      window.confirm("수정 권한이 없습니다.");
      navigate(`/crew/${crewNo}/board/detail/${boardNo}`);
    }
  };

  /**
   * 4. 데이터 로딩
   */
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([checkMemberStatus(), fetchBoardData()]);
      setIsLoading(false);
    };

    if (userNo) {
      loadData();
    }
  }, [userNo, crewNo, boardNo]);

  /**
   * 5. 권한 체크
   */
  useEffect(() => {
    if (!isLoading) {
      checkPermissions();
    }
  }, [isLoading, isMember, board.boardWriter, userNo]);

  /**
   * 6. 프로필 불러오기
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/member/mypage/${userNo}`
        );
        setProfile(res.data);
      } catch (err) {
        console.error("프로필 불러오기 실패:", err);
      }
    };

    if (userNo) {
      fetchProfile();
    }
  }, [userNo]);

  /**
   * 7. 게시글 수정
   */
  const handleEdit = async () => {
    if (
      !board.boardTitle.trim() ||
      !board.boardContent.trim() ||
      !board.boardCategory.trim()
    ) {
      window.confirm("카테고리, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/board/${boardNo}`, {
        boardTitle: board.boardTitle,
        boardContent: board.boardContent,
        boardCategory: board.boardCategory,
      });

      window.confirm("게시글이 수정되었습니다.");
      navigate(`/crew/${crewNo}/board/detail/${boardNo}`);
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      window.confirm("게시글 수정에 실패했습니다.");
    }
  };

  return (
    <>
      <Header
        loginState={`${login ? "loggined" : "login"}`}
        // location={location}
        // setLocation={setLocation}
        input={false}
      />
      <div className="container py-4">
        {/* 목록으로 버튼 */}
        <div className="mb-5">
          <Link to="/crew/board" className="btn btn-outline-secondary btn-sm">
            목록으로
          </Link>
        </div>
        {profile && (
          <div className="d-flex align-items-center mb-4">
            <img
              src={`http://localhost:8080/api/member/image/${userNo}`}
              alt="프로필"
              className="rounded-circle me-3"
              style={{ width: "3rem", height: "3rem", objectFit: "cover" }}
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

        {/* 카테고리 선택
        <div className="d-flex flex-wrap gap-2 mb-4">
          {crewCategories.map((cat) => (
            <button
              key={cat}
              className="btn btn-sm rounded-pill"
              style={{
                backgroundColor:
                  board.boardCategory === cat ? "#F9B4ED" : "#ffffff",
                color: board.boardCategory === cat ? "#ffffff" : "#F9B4ED",
                border:
                  board.boardCategory === cat ? "none" : "1px solid #F9B4ED",
              }}
              onClick={() => setBoard({ ...board, boardCategory: cat })}
            >
              {cat}
            </button>
          ))}
        </div> */}
        {/* --- 카테고리 선택 --- */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {crewCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="btn btn-sm rounded-pill px-3"
              style={{
                backgroundColor:
                  board.boardCategory === cat ? "#000000" : "#f1f3f5",
                color: board.boardCategory === cat ? "#ffffff" : "#000000",
                border: "none",
                padding: "0.5rem 1rem",
                fontSize: "0.95rem",
              }}
              onClick={() => setBoard({ ...board, boardCategory: cat })}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 제목 입력 */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="제목을 입력하세요"
            value={board.boardTitle}
            onChange={(e) => setBoard({ ...board, boardTitle: e.target.value })}
            disabled={board.boardWriter !== userNo}
          />
        </div>

        {/* 내용 입력 */}
        <div className="mb-4">
          <textarea
            className="form-control"
            rows="15"
            placeholder="내용을 입력하세요"
            value={board.boardContent}
            onChange={(e) =>
              setBoard({ ...board, boardContent: e.target.value })
            }
            disabled={board.boardWriter !== userNo}
            style={{ minHeight: "300px" }}
          ></textarea>
        </div>

        {/* 버튼들 */}
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-primary px-4"
            onClick={handleEdit}
            disabled={board.boardWriter !== userNo}
          >
            수정하기
          </button>

          <button
            className="btn btn-secondary px-4"
            onClick={() => navigate(`/crew/${crewNo}/board/detail/${boardNo}`)}
          >
            뒤로가기
          </button>
        </div>
      </div>
    </>
  );
}
