import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Link 추가
import axios from "axios";
import Header from "../components/Header";
import { loginState, userNoState } from "../utils/storage";
import { useRecoilValue } from "recoil";

export default function JoinBoardEdit() {
  const { boardNo } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState({
    boardTitle: "",
    boardContent: "",
    boardCategory: "",
  });
  const [profile, setProfile] = useState(null);
  //로그인 관련
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
    "자기개발",
    "요리",
  ];

  // 게시글 불러오기
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/board/${boardNo}`
        );
        setBoard({
          boardTitle: res.data.boardTitle,
          boardContent: res.data.boardContent,
          boardCategory: res.data.boardCategory,
          boardWriter: res.data.boardWriter,
        });
        // 작성자와 로그인한 사용자가 다를 경우 접근 차단
        if (res.data.boardWriter !== userNo) {
          // if (userNo && res.data.boardWriter !== userNo) {
          alert("수정 권한이 없습니다.");
          navigate(`/join/board/detail/${boardNo}`);
        }
      } catch (err) {
        console.error(err);
        alert("게시글 정보를 불러오는데 실패했습니다.");
        navigate("/join/board");
      }
    };
    // if (userNo) fetchBoard();
    fetchBoard();
  }, [boardNo, navigate, userNo]);

  // 프로필 불러오기
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       // 실제 프로필 불러오기 코드 (주석 해제 시 사용)
  //       // const res = await axios.get("http://localhost:8080/api/profile");
  //       // setProfile(res.data);

  //       // 더미 프로필 데이터
  //       setProfile({
  //         boardWriterProfileUrl: "/images/default-profile.png",
  //         boardWriterNickname: "테스트유저",
  //         boardWriterGender: "M",
  //         boardWriterBirth: "1995-08-15",
  //         boardWriterMbti: "ENTP",
  //       });
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchProfile();
  // }, []);

  // 프로필 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userNo) {
        console.warn("userNo가 유효하지 않습니다.");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8080/api/member/mypage/${userNo}`
        );
        setProfile(res.data);
      } catch (err) {
        console.error("프로필 불러오기 실패:", err);
      }
    };

    fetchProfile();
  }, [userNo]);

  const handleEdit = async () => {
    if (
      !board.boardTitle.trim() ||
      !board.boardContent.trim() ||
      !board.boardCategory.trim()
    ) {
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
          <Link to="/join/board" className="btn btn-outline-secondary btn-sm">
            목록으로
          </Link>
        </div>

        {/* 프로필 정보 */}
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

        {/* 카테고리 선택 */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="btn btn-sm rounded-pill"
              style={{
                backgroundColor:
                  board.boardCategory === cat ? "#000000" : "#f1f3f5",
                color: board.boardCategory === cat ? "#ffffff" : "#000000",
                border: "none",
                padding: "0.5rem 1.2rem",
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
            style={{ fontSize: "1rem", padding: "0.75rem" }}
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
            style={{
              fontSize: "1rem",
              padding: "1.2rem",
              minHeight: "400px", // 추가
              resize: "vertical", // 사용자가 크기 조정 가능하게
            }}
          ></textarea>
        </div>

        {/* 수정 버튼 */}
        {/* <div
          className="text-center d-flex justify-content-center"
          style={{ gap: "2rem" }}
        >
          <button
            // className="btn btn-primary px-5 py-2"
            // style={{ fontSize: "1rem" }}
            // onClick={handleEdit}
            className="btn btn-primary px-5 py-2"
            style={{ fontSize: "1rem" }}
            onClick={handleEdit}
            disabled={board.boardWriter !== userNo} // 권한이 없으면 비활성화
          >
            수정하기
          </button>
          <button
            className="btn btn-secondary px-5 py-2"
            style={{ fontSize: "1rem" }}
            onClick={() => navigate(`/join/board/detail/${boardNo}`)}
          >
            뒤로가기
          </button>
        </div> */}
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
            onClick={() => navigate(`/join/board/detail/${boardNo}`)}
          >
            뒤로가기
          </button>
        </div>
      </div>
    </>
  );
}
