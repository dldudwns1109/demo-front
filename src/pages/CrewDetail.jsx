import { useEffect, useState, useRef } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { loginState, locationState, categoryState } from "../utils/storage";
import Header from "../components/Header";
import CrewTopNav from "../components/CrewTopNav";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaShareAlt,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaUserAlt,
} from "react-icons/fa";
import "../css/CrewDetail.css";
import MeetingCard from "../components/MeetingCard";

export default function CrewDetail() {
  const navigate = useNavigate();
  const login = useRecoilValue(loginState);
  const [location, setLocation] = useRecoilState(locationState);
  const [category, setCategory] = useRecoilState(categoryState);
  const { crewNo } = useParams();

  const [crewData, setCrewData] = useState(null);
  const [members, setMembers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isMember, setIsMember] = useState(false);
  // const [isCrewMember, setIsCrewMember] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  // const [crewImage, setCrewImage] = useState("/images/dummy-crew.jpg");
  // const [showJoinInput, setShowJoinInput] = useState(false);
  const setShowReportInput = useState(false)[1];
  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const joinSheetRef = useRef(null);
  const [joinMessage, setJoinMessage] = useState("");
  // const [reportMessage, setReportMessage] = useState("");
  const [showPopoverId, setShowPopoverId] = useState(null);
  const popoverRef = useRef();

  const [meetingCount, setMeetingCount] = useState(0);
  const [meetingList, setMeetingList] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("refreshToken");
    return { Authorization: `Bearer ${token.trim()}` };
  };

  //모임 멤버 목록 불러오기
  const fetchMembers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/crewmember/${crewNo}/members`
      );

      const fetchedMembers = Array.isArray(response.data) ? response.data : [];

      const sortedMembers = [
        ...fetchedMembers.filter((member) => member.leader === "Y"),
        ...fetchedMembers.filter((member) => member.leader !== "Y"),
      ];

      // setMembers(fetchedMembers);
      setMembers(sortedMembers);
    } catch (err) {
      console.error("Error fetching members data:", err.message);
    }
  };

  //가입하기 버튼 클릭 시
  const handleJoinClick = async () => {
    try {
      const token = localStorage.getItem("refreshToken");

      if (!token || token.trim() === "") {
        window.confirm("로그인이 필요합니다.");
        return;
      }

      const authHeader = `Bearer ${token.trim()}`;

      if (joinMessage.trim() === "") {
        window.confirm("가입 인사를 입력해 주세요.");
        return;
      }

      console.log("Authorization Header:", authHeader); // 디버깅용

      const response = await axios.post(
        `http://localhost:8080/api/crewmember/${crewNo}/join`,
        {},
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      if (response.status === 200) {
        window.confirm("모임에 가입되었습니다.");
        setIsMember(true);
        setShowJoinSheet(false);
        setJoinMessage("");

        await fetchMembers();
      }
    } catch (err) {
      console.error("Error joining crew:", err.message);
      window.confirm("모임 가입에 실패했습니다.");
    }
  };

  const handleOutsideClick = (e) => {
    if (
      showJoinSheet &&
      joinSheetRef.current &&
      !joinSheetRef.current.contains(e.target)
    ) {
      setShowJoinSheet(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showJoinSheet]);

  /** 
     모임 정보 및 회원 목록 불러오기 
     로그인 여부와 관계없이 항상 실행됨 
   */
  useEffect(() => {
    const fetchCrewData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/crew/${crewNo}`
        );
        setCrewData(response.data);
      } catch (err) {
        console.error("Error fetching crew data:", err.message);
      }
    };

    const fetchMeetingCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/meeting/list/${crewNo}`
        );
        setMeetingList(response.data);
        setMeetingCount(response.data.length); // ✅ 여기서 count 설정
      } catch (err) {
        console.error("정모 목록 불러오기 실패:", err);
      }
    };

    fetchCrewData();
    fetchMembers();
    fetchMeetingCount();
  }, [crewNo]);

  /* 로그인 시 추가적으로 체크할 정보들 */
  useEffect(() => {
    if (!login) return;

    const fetchMemberStatus = async () => {
      try {
        const headers = getAuthHeaders();

        // 모임장 여부 확인
        const leaderRes = await axios.get(
          `http://localhost:8080/api/crewmember/${crewNo}/leader`,
          { headers }
        );
        setIsLeader(leaderRes.data);

        // 모임원 여부 확인
        const memberRes = await axios.get(
          `http://localhost:8080/api/crewmember/${crewNo}/member`,
          { headers }
        );
        setIsMember(memberRes.data);

        // 찜 여부 확인
        // const likeRes = await axios.get(
        //   `http://localhost:8080/api/crewmember/${crewNo}/like`,
        //   { headers }
        // );
        // setIsLiked(likeRes.data);
      } catch (err) {
        console.error("Error fetching member status:", err.message);
      }
    };

    fetchMemberStatus();
  }, [login, crewNo]);

  /** 모임 탈퇴 처리 */
  const handleLeaveClick = async () => {
    const confirmLeave = window.confirm("정말 모임을 탈퇴하시겠습니까?");

    if (!confirmLeave) return;

    if (!isMember) {
      window.confirm("모임원이 아닙니다.");
      return;
    }

    if (isLeader) {
      window.confirm("모임장은 탈퇴할 수 없습니다. 모임 해체를 해주세요.");
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await axios.delete(
        `http://localhost:8080/api/crewmember/${crewNo}/leave`,
        { headers }
      );

      if (response.data) {
        window.confirm("모임에서 탈퇴되었습니다.");
        setIsMember(false);
        fetchMembers();
      } else {
        window.confirm("모임 탈퇴에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error leaving crew:", err.message);
      window.confirm("모임 탈퇴에 실패했습니다.");
    }
  };

  /** 모임 해체 처리 */
  // const handleDeleteCrew = async () => {
  //   if (!isLeader) {
  //     window.confirm("모임장만 해체할 수 있습니다.");
  //     return;
  //   }

  //   try {
  //     const headers = getAuthHeaders();
  //     await axios.delete(`http://localhost:8080/api/crew/${crewNo}`, {
  //       headers,
  //     });
  //     window.confirm("모임이 해체되었습니다.");
  //     navigate("/crew");
  //   } catch (err) {
  //     console.error("Error deleting crew:", err.message);
  //     window.confirm("모임 해체에 실패했습니다.");
  //   }
  // };

  // 가입처리
  // const handleJoin = () => {
  //   setShowJoinInput(true);
  // };

  // 신고처리
  const handleReport = () => {
    setShowReportInput(true);
  };

  // 좋아요 처리
  const handleHeartClick = () => {
    if (!login) {
      window.confirm("비회원은 사용할 수 없는 기능입니다.");
      return;
    }
    // setIsLiked(!isLiked);
    setIsLiked((prev) => !prev);
  };

  // 모임 멤버 더보기
  const handleLoadMoreMembers = () => {
    setVisibleCount((prev) => prev + 5);
  };

  // 팝오버 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowPopoverId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Header
        loginState={login ? "loggined" : "login"}
        category={category}
        setCategory={setCategory}
        location={location}
        setLocation={setLocation}
      />

      <div
        className="container"
        style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
      >
        <CrewTopNav />

        <div className="crew-detail-container">
          <div
            className="crew-image-section"
            style={{
              marginBottom: "1.5rem",
              height: "20rem",
            }}
          >
            <img
              src={`http://localhost:8080/api/crew/image/${crewNo}`}
              alt="Crew"
              className="crew-image"
            />
            <div
              className="action-buttons"
              style={{ padding: "0.2rem 0.4rem" }}
            >
              {/* 공유하기 - 모든 사용자에게 표시 */}
              <button
                className="action-btn share-btn"
                style={{ padding: "0.2rem 0.4rem" }}
              >
                <FaShareAlt /> 공유하기
              </button>

              {/* 신고하기 - 모든 사용자에게 표시 */}
              <button
                className="action-btn report-btn"
                onClick={handleReport}
                style={{ padding: "0.2rem 0.4rem" }}
              >
                <FaExclamationTriangle /> 신고하기
              </button>

              {/* 모임원 전용: 탈퇴하기 */}
              {login && isMember && !isLeader && (
                <button
                  className="action-btn leave-btn"
                  onClick={handleLeaveClick}
                  // style={{ padding: "0.2rem 0.4rem" }}
                  style={{
                    backgroundColor: "#FF4D4F",
                    color: "#FFF",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  탈퇴하기
                </button>
              )}

              {/* 모임장 전용: 수정하기 / 해체하기 */}
              {login && isLeader && (
                <>
                  <Link
                    to={`/crew/${crewNo}/edit`}
                    className="action-btn edit-btn"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0.2rem 0.4rem",
                      textDecoration: "none",
                    }}
                  >
                    모임 수정
                  </Link>

                  <Link
                    to={`/crew/${crewNo}/delete`}
                    className="action-btn delete-btn"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0.2rem 0.4rem",
                      textDecoration: "none",
                    }}
                  >
                    모임 해체
                  </Link>
                </>
              )}

              <button
                className={`action-btn heart-btn ${isLiked ? "liked" : ""}`}
                style={{
                  padding: "0.2rem 0.4rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s, color 0.3s",
                }}
                onClick={handleHeartClick}
              >
                <FaHeart />
              </button>
            </div>
          </div>

          <div className="crew-intro" style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              {crewData?.crewName}
            </h2>
            <div
              className="crew info"
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <span>{crewData?.crewCategory}</span> ·
              <span style={{ display: "flex", alignItems: "center" }}>
                <FaMapMarkerAlt
                  style={{ marginRight: "0.3rem", color: "#6C757D" }}
                />
                {crewData?.crewLocation}
              </span>{" "}
              ·
              <span style={{ display: "flex", alignItems: "center" }}>
                <FaUsers style={{ marginRight: "0.3rem", color: "#6C757D" }} />
                회원 {members.length || 0}명
              </span>
            </div>
            <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
              모임 소개
            </p>
            <p style={{ marginBottom: "1.5rem" }}>{crewData?.crewIntro}</p>
          </div>

          {/* 정모 일정 제목 + 버튼 */}
          <div
            className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
            style={{ gap: "8px" }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                margin: 0,
              }}
            >
              정모 일정 {meetingCount}
            </h3>

            <button
              className="btn btn-primary"
              style={{
                padding: "12px",
                backgroundColor: "#007BFF",
                color: "#ffffff",
                fontWeight: "bold",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
              onClick={() =>
                navigate("/meeting/create", {
                  state: { crewNo: Number(crewNo) },
                })
              }
            >
              정모 추가
            </button>
          </div>

          {/* 정모 카드 목록 */}
          <div
            className="d-flex flex-wrap"
            style={{ justifyContent: "flex-start", gap: "60px" }}
          >
            {meetingList.map((meeting) => (
              <MeetingCard
                key={meeting.meetingNo}
                meeting={meeting}
                crewNo={crewNo}
              />
            ))}
          </div>

          <div className="member-section" style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              모임 멤버 {members.length || 0}
            </h3>
            <div
              className="member-list"
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* {Array.isArray(members) && members.length > 0 ? ( */}
              {members.length > 0 ? (
                members
                  // slice(0, visibleCount).
                  .map((member) => (
                    <div
                      key={member.memberNo}
                      className="member-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        justifyContent: "space-between",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        // width: "100%",
                        // maxWidth: "250px",
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      {/* 이미지 */}
                      <img
                        src={`http://localhost:8080/api/member/image/${member.memberNo}`}
                        alt="프로필"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "1rem",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPopoverId(
                            showPopoverId === member.memberNo
                              ? null
                              : member.memberNo
                          );
                        }}
                      />

                      {/* 닉네임 + 회장/일반회원 */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          flex: 1,
                        }}
                      >
                        <p
                          style={{
                            fontWeight: "bold",
                            margin: 0,
                            // marginBottom: "0.2rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {member.nickname || "회원"}
                        </p>

                        <span
                          style={{
                            color: member.leader === "Y" ? "#F9B4ED" : "#888",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {member.leader === "Y" ? "회장" : "회원"}
                        </span>
                      </div>
                      {/* 팝오버 */}
                      {showPopoverId === member.memberNo && (
                        <div
                          ref={popoverRef}
                          className="shadow position-absolute bg-white rounded p-3"
                          style={{
                            top: "3.5rem",
                            left: "1rem",
                            zIndex: 10,
                            width: "300px",
                            fontSize: "0.9rem",
                            border: "1px solid #ddd",
                          }}
                        >
                          <div className="d-flex align-items-center mb-3">
                            <img
                              src="/images/default-profile.png"
                              alt="프로필"
                              className="rounded-circle me-3"
                              style={{
                                width: "3.5rem",
                                height: "3.5rem",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <div className="fw-bold">{member.nickname}</div>
                              <div className="badge bg-info text-white me-1">
                                {member.mbti || "정보 없음"}
                              </div>
                            </div>
                          </div>

                          <div className="text-muted mb-2">
                            {member.location || "지역 정보 없음"} ·{" "}
                            {member.birth || "생년월일 없음"}
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
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.8rem" }}
                            >
                              모임 이름
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <p>가입된 멤버가 없습니다.</p>
              )}
            </div>

            {/* 더보기 버튼 */}
            {visibleCount < members.length && (
              <div className="text-center mt-3">
                <button
                  className="btn btn-primary"
                  onClick={handleLoadMoreMembers}
                  style={{ padding: "0.5rem 1rem" }}
                >
                  더보기
                </button>
              </div>
            )}
          </div>

          {/* 하단 고정 시트 */}
          {login && !isMember && (
            <div
              className="bottom-sheet"
              onClick={() => setShowJoinSheet(true)}
            >
              모임 가입하기
            </div>
          )}

          {/* 바텀 시트 내용 */}
          {showJoinSheet && (
            <div className="bottom-sheet-content" ref={joinSheetRef}>
              <div className="join-sheet-body">
                <input
                  type="text"
                  placeholder="가입 인사를 입력하세요"
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  maxLength={100}
                />
                <button className="join-btn" onClick={handleJoinClick}>
                  모임 가입하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
