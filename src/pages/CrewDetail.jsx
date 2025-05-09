import { useEffect, useState, useRef } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { loginState, locationState } from "../utils/storage";
import Header from "../components/Header";
import CrewTopNav from "../components/CrewTopNav";
import { Link, useParams } from "react-router-dom";
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

export default function CrewDetail() {
  const login = useRecoilValue(loginState);
  const [location, setLocation] = useRecoilState(locationState);
  const { crewNo } = useParams();

  const [crewData, setCrewData] = useState(null);
  const [members, setMembers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isMember, setIsMember] = useState(false);
  // const [isCrewMember, setIsCrewMember] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [crewImage, setCrewImage] = useState("/images/dummy-crew.jpg");
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [showReportInput, setShowReportInput] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  const [showPopoverId, setShowPopoverId] = useState(null);
  const popoverRef = useRef();

  const [meetingCount, setMeetingCount] = useState(0);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("refreshToken");
    return { Authorization: `Bearer ${token.trim()}` };
  };

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

    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/crewmember/${crewNo}/members`
        );
        setMembers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching members data:", err.message);
      }
    };

    const fetchMeetingCount = async () => {
      try {
        // 더미 데이터로 0으로 설정 (구현 예정이므로)
        setMeetingCount(0);
      } catch (err) {
        console.error("Error fetching meeting count:", err.message);
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
        const likeRes = await axios.get(
          `http://localhost:8080/api/crewmember/${crewNo}/like`,
          { headers }
        );
        setIsLiked(likeRes.data);
      } catch (err) {
        console.error("Error fetching member status:", err.message);
      }
    };

    fetchMemberStatus();
  }, [login, crewNo]);

  // 가입처리
  const handleJoin = () => {
    setShowJoinInput(true);
  };

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
              src={crewImage}
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
                  style={{ padding: "0.2rem 0.4rem" }}
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
                <FaMapMarkerAlt style={{ marginRight: "0.3rem" }} />
                {crewData?.crewLocation}
              </span>{" "}
              ·
              <span style={{ display: "flex", alignItems: "center" }}>
                <FaUsers style={{ marginRight: "0.3rem" }} />
                회원 {members.length || 0}명
              </span>
            </div>
            <p style={{ marginBottom: "0.5rem" }}>모임 소개</p>
            <p style={{ marginBottom: "1.5rem" }}>{crewData?.crewIntro}</p>
          </div>

          {/* 정모 일정 */}
          <div className="meeting-schedule" style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaCalendarAlt style={{ marginRight: "0.5rem" }} />
              정모 일정 {meetingCount}
            </h3>
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
              <FaUserAlt style={{ marginRight: "0.5rem" }} />
              모임 멤버 {members.length || 0}
            </h3>
            <div
              className="member-list"
              style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
            >
              {/* {Array.isArray(members) && members.length > 0 ? ( */}
              {members.length > 0 ? (
                members.slice(0, visibleCount).map((member) => (
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
                    {/* 더미 이미지 */}
                    <img
                      src="/images/default-profile.png"
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

                    {/* 닉네임 */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: "bold", marginBottom: "0.2rem" }}>
                        {/* {member.nickname ? member.nickname : "회원"} */}
                        {member.nickname || "회원"}
                      </p>
                    </div>

                    {/* 모임장 여부 */}
                    <div
                      style={{
                        color: member.leader === "Y" ? "#F9B4ED" : "#888",
                      }}
                    >
                      {member.leader === "Y" ? "회장" : "일반 회원"}
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

          {showJoinInput && (
            <div className="input-box">
              <input
                type="text"
                placeholder="모임장님께 가입인사를 작성하세요!"
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
              />
              <button onClick={() => setShowJoinInput(false)}>가입하기</button>
            </div>
          )}

          {showReportInput && (
            <div className="input-box">
              <input
                type="text"
                placeholder="허위 신고는 계정 정지가 될 수 있다는 점 유의해주세요"
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
              />
              <button onClick={() => setShowReportInput(false)}>
                신고하기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
