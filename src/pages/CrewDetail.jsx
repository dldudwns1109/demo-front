import { useEffect, useState, useRef } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  loginState,
  locationState,
  categoryState,
  userNoState,
} from "../utils/storage";
import Header from "../components/Header";
import CrewTopNav from "../components/CrewTopNav";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import "../css/CrewDetail.css";
import MeetingCard from "../components/MeetingCard";
import { windowWidthState } from "../utils/storage";
import ProfilePopover from "../components/ProfilePopover";
import changeIcon from "../utils/changeIcon";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

export default function CrewDetail() {
  const navigate = useNavigate();
  const login = useRecoilValue(loginState);
  const userNo = useRecoilValue(userNoState);
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
  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const joinSheetRef = useRef(null);
  const reportSheetRef = useRef(null);
  const [joinMessage, setJoinMessage] = useState("");
  // const [reportMessage, setReportMessage] = useState("");
  const [showPopoverId, setShowPopoverId] = useState(null);
  const popoverRef = useRef();
  const modalRef = useRef(null);

  const [userNickname, setUserNickname] = useState("");

  const [reportMessage, setReportMessage] = useState("");
  const [showReportSheet, setShowReportSheet] = useState(false);

  const [meetingCount, setMeetingCount] = useState(0);
  const [meetingList, setMeetingList] = useState([]);

  const windowWidth = useRecoilValue(windowWidthState);
  // 상태: 초기 1줄만 보여주기
  const [visibleRows, setVisibleRows] = useState(1);
  // 칼럼 수 계산
  const columnCount = windowWidth > 1024 ? 3 : windowWidth > 768 ? 2 : 1;
  // 보여줄 개수 계산
  const [meetingvisibleCount, setMeetingVisibleCount] = useState(columnCount);

  const [isManaging, setIsManaging] = useState(false);

  // windowWidth나 visibleRows가 변경되면 visibleCount 재계산
  useEffect(() => {
    setMeetingVisibleCount(columnCount * visibleRows);
  }, [columnCount, visibleRows]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("refreshToken");
    return { Authorization: `Bearer ${token.trim()}` };
  };

  /* 모임 데이터 불러오기 */
  const fetchCrewData = async () => {
    try {
      const res = await axios.get(`/crew/${crewNo}`);
      setCrewData(res.data);
    } catch (err) {
      console.error("모임 데이터 불러오기 실패:", err.message);
    }
  };

  /* 찜 여부 확인 */
  const checkLikeStatus = async () => {
    if (!login || !userNo) return;

    try {
      const res = await axios.get(`/crew/findLikeGroup/${userNo}`, {
        headers: getAuthHeaders(),
      });

      // 찜한 모임 중 현재 모임이 있는지 확인
      const likedGroups = res.data;
      const isLikedGroup = likedGroups.some(
        (group) => group.crewNo === parseInt(crewNo)
      );

      setIsLiked(isLikedGroup);
    } catch (err) {
      console.error("찜 여부 확인 실패:", err.message);
    }
  };

  /* 찜(좋아요) 토글 */
  const handleHeartClick = async () => {
    if (!login) {
      window.confirm("로그인이 필요합니다.");
      return;
    }

    const payload = {
      crewNo: parseInt(crewNo),
      memberNo: userNo,
    };

    try {
      if (isLiked) {
        await axios.delete(`/crew/deleteLike`, {
          data: payload,
          headers: getAuthHeaders(),
        });
      } else {
        await axios.post(`/crew/updateLike`, payload, {
          headers: getAuthHeaders(),
        });
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("찜 처리 실패:", err.message);
      window.confirm("찜 처리에 실패했습니다.");
    }
  };

  //모임 멤버 목록 불러오기
  const fetchMembers = async () => {
    try {
      const response = await axios.get(`/crewmember/${crewNo}/members`);

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

  /* 초기 데이터 로드 */
  useEffect(() => {
    fetchCrewData();
    checkLikeStatus();
    fetchMembers();
  }, [crewNo, login, userNo]);

  useEffect(() => {
    const fetchMemberStatus = async () => {
      try {
        const headers = getAuthHeaders();
        const leaderRes = await axios.get(`/crewmember/${crewNo}/leader`, {
          headers,
        });
        setIsLeader(leaderRes.data);
      } catch (err) {
        console.error("Error checking leader status:", err.message);
      }
    };

    if (login) fetchMemberStatus();
  }, [login, crewNo]);

  const handleJoinClick = async () => {
    try {
      if (crewData?.crewLimit && members.length >= crewData.crewLimit) {
        window.confirm("모임 인원이 가득 찼습니다. 모임장에게 문의하세요.");
        return;
      }

      const token = localStorage.getItem("refreshToken");
      if (!token || token.trim() === "") {
        window.confirm("로그인이 필요합니다.");
        return;
      }

      const authHeader = `Bearer ${token.trim()}`;
      const response = await axios.post(
        `/crewmember/${crewNo}/join`,
        { chatContent: joinMessage },
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

    if (
      isManaging &&
      modalRef.current &&
      !modalRef.current.contains(e.target)
    ) {
      setIsManaging(false);
    }

    if (
      showReportSheet &&
      reportSheetRef.current &&
      !reportSheetRef.current.contains(e.target)
    ) {
      setShowReportSheet(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showJoinSheet, isManaging, showReportSheet]);

  /** 
     모임 정보 및 회원 목록 불러오기 
     로그인 여부와 관계없이 항상 실행됨 
   */
  useEffect(() => {
    const fetchCrewData = async () => {
      try {
        const response = await axios.get(`/crew/${crewNo}`);
        setCrewData(response.data);
      } catch (err) {
        console.error("Error fetching crew data:", err.message);
      }
    };

    const fetchMeetingCount = async () => {
      try {
        const response = await axios.get(`/meeting/list/${crewNo}`);
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
        const leaderRes = await axios.get(`/crewmember/${crewNo}/leader`, {
          headers,
        });
        setIsLeader(leaderRes.data);

        // 모임원 여부 확인
        const memberRes = await axios.get(`/crewmember/${crewNo}/member`, {
          headers,
        });
        setIsMember(memberRes.data);
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
      const response = await axios.delete(`/crewmember/${crewNo}/leave`, {
        headers,
      });

      if (response.data) {
        window.confirm(
          "모임에서 탈퇴되었습니다. 작성한 게시글과 댓글은 모두 삭제됩니다."
        );
        setIsMember(false);
        fetchMembers();
        window.location.reload();
      } else {
        window.confirm("모임 탈퇴에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error leaving crew:", err.message);
      window.confirm("모임 탈퇴에 실패했습니다.");
    }
  };

  const handleKickMember = async (memberNo) => {
    const confirmKick = window.confirm("해당 회원을 강퇴하시겠습니까?");
    if (!confirmKick) return;

    try {
      const res = await axios.delete(`/crewmember/${crewNo}/kick/${memberNo}`, {
        headers: getAuthHeaders(),
      });

      if (res.status === 200) {
        alert("회원이 강퇴되었습니다.");
        fetchMembers();
        window.location.reload();
      }
    } catch (err) {
      console.error("강퇴 실패:", err.message);
      alert("회원 강퇴에 실패했습니다.");
    }
  };

  const handleShareClick = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      window.confirm("주소가 복사되었습니다.");
    } catch (err) {
      console.error("URL 복사 실패:", err.message);
      window.confirm("URL 복사에 실패했습니다.");
    }
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

  const handleReportClick = () => {
    if (!login) {
      const confirmLogin = window.confirm(
        "로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
      );
      if (confirmLogin) {
        navigate("/signin");
      }
      return;
    }
    setShowReportSheet(true);
  };

  useEffect(() => {
    const fetchUserNickname = async () => {
      try {
        const response = await axios.get(`/member/${userNo}/nickname`);
        setUserNickname(response.data);
      } catch (err) {
        console.error("닉네임 불러오기 실패:", err.message);
      }
    };

    if (userNo) fetchUserNickname();
  }, [userNo]);

  const handleReportSubmit = async () => {
    if (!reportMessage.trim()) {
      window.alert("신고 내용을 입력해주세요.");
      return;
    }

    try {
      const payload = {
        crewNo: crewNo,
        crewName: crewData?.crewName,
        reportContent: reportMessage,
        reporterNo: userNo,
        reporterName: userNickname,
      };

      console.log("신고 전송 데이터:", payload);

      await axios.post("/report", payload);

      window.alert("신고가 접수되었습니다.");
      setReportMessage("");
      setShowReportSheet(false);
    } catch (err) {
      console.error("신고 처리 오류:", err.message);
      window.alert("신고 처리에 실패했습니다.");
    }
  };

  return (
    <div className="vh-100">
      <div style={{ position: "relative", zIndex: 1100 }}>
        <Header input={false} loginState={login ? "loggined" : "login"} />
      </div>
      <div
        style={{
          position: "fixed",
          top: "70px",
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#fff",
        }}
      >
        <CrewTopNav />
      </div>

      <div style={{ paddingTop: "160px", paddingBottom: "80px" }}>
        <div style={{ paddingLeft: "8.33%", paddingRight: "8.33%" }}>
          <div className="crew-detail-container p-4">
            <div
              className="crew-image-section"
              style={{
                marginBottom: "1.5rem",
                height: "20rem",
              }}
            >
              <img
                src={`${
                  import.meta.env.VITE_AJAX_BASE_URL
                }/crew/image/${crewNo}`}
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
                  onClick={handleShareClick}
                >
                  {/* <FaShareAlt />  */}
                  공유하기
                </button>

                {/* 신고하기 - 모든 사용자에게 표시 */}
                <button
                  className="action-btn report-btn"
                  onClick={handleReportClick}
                  style={{ padding: "0.2rem 0.4rem" }}
                >
                  {/* <FaExclamationTriangle />  */}
                  신고하기
                </button>

                {/* 모임원 전용: 탈퇴하기 */}
                {login && isMember && !isLeader && (
                  <button
                    className="action-btn leave-btn"
                    onClick={handleLeaveClick}
                    style={{
                      padding: "0.2rem 0.4rem",
                      backgroundColor: "#FF4D4F",
                      color: "#FFF",
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
                      모임수정
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
                      모임해체
                    </Link>
                  </>
                )}

                <button
                  className="d-flex justify-content-center align-items-center border-0 p-2 bg-white"
                  style={{
                    right: "8px",
                    bottom: "8px",
                    borderRadius: "999px",
                    width: "36px",
                    height: "36px",
                  }}
                  onClick={handleHeartClick}
                >
                  {isLiked ? (
                    <IoHeartSharp size={20} color="#DC3545" />
                  ) : (
                    <IoHeartOutline size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="crew-intro" style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                {crewData?.crewName}
              </h2>
              <div
                className="crew info"
                style={{
                  display: "flex",
                  gap: "0.3rem",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                {changeIcon(crewData?.crewCategory)}
                <span>{crewData?.crewCategory}</span> ·
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FaMapMarkerAlt
                    style={{ marginRight: "0.3rem", color: "#6C757D" }}
                  />
                  {crewData?.crewLocation}
                </span>{" "}
                ·
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FaUsers
                    style={{ marginRight: "0.3rem", color: "#6C757D" }}
                  />
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
              // className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
              className="d-flex flex-wrap align-items-center justify-content-between mb-4"
              style={{
                gap: "8px",
                flexWrap: "nowrap",
                width: "100%",
                maxWidth: "100%",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                정모 일정 {meetingCount}
              </h3>

              {login && isMember && (
                <button
                  className="btn btn-primary"
                  style={{
                    padding: "8px",
                    backgroundColor: "#007BFF",
                    color: "#ffffff",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    flexShrink: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() =>
                    navigate("/meeting/create", {
                      state: { crewNo: Number(crewNo) },
                    })
                  }
                >
                  정모 추가
                </button>
              )}
            </div>

            {/* 정모 카드 목록 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                gap: "60px",
              }}
            >
              {meetingList.slice(0, meetingvisibleCount).map((meeting) => (
                <MeetingCard
                  key={meeting.meetingNo}
                  meeting={meeting}
                  crewNo={crewNo}
                />
              ))}
            </div>

            {meetingList.length > meetingvisibleCount && (
              <div className="text-center mt-4">
                <button
                  className="btn btn-primary"
                  style={{
                    padding: "8px",
                    backgroundColor: "#007BFF",
                    color: "#ffffff",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                  onClick={() => setVisibleRows((prev) => prev + 1)}
                >
                  정모 더보기
                </button>
              </div>
            )}

            {/* 회원 관리 버튼 - 모임장 전용 */}
            {login && isLeader && (
              <button
                className="btn btn-primary"
                onClick={() => setIsManaging(true)}
                style={{ marginBottom: "1rem" }}
              >
                회원 관리
              </button>
            )}

            {/* 모달 */}
            {isManaging && (
              <div
                className="modal-overlay"
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
              >
                <div
                  className="modal-content"
                  ref={modalRef}
                  style={{
                    width: "400px",
                    maxHeight: "450px",
                    backgroundColor: "#FFFFFF",
                    // overflowY: "auto",
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* 통합된 컨테이너 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0", // 간격 완전히 제거
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#FFFFFF",
                        // padding: "12px",
                        padding: "10px 16px",
                        borderBottom: "1px solid #EEE",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      회원 관리
                    </div>

                    <div
                      style={{
                        maxHeight: "450px",
                        overflowY: "auto",
                        padding: "0",
                      }}
                    >
                      {members.length > 0 ? (
                        members.map((member) => (
                          <div
                            key={member.memberNo}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "10px",
                              backgroundColor: "#FFFFFF", // 여기에서 배경색을 강제 설정
                              borderBottom: "1px solid #EEE",
                              gap: "12px",
                            }}
                          >
                            <img
                              src={`${
                                import.meta.env.VITE_AJAX_BASE_URL
                              }/member/image/${member.memberNo}`}
                              alt="프로필"
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginRight: "12px",
                              }}
                            />

                            <span
                              style={{
                                flex: 1,
                                fontWeight: "500",
                                color: "#333",
                              }}
                            >
                              {member.nickname}
                            </span>

                            {member.leader !== "Y" && (
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  handleKickMember(member.memberNo)
                                }
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  backgroundColor: "#FF4D4F",
                                  color: "#FFFFFF",
                                  borderRadius: "6px",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                강퇴
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p
                          style={{
                            textAlign: "center",
                            color: "#888",
                            padding: "16px",
                          }}
                        >
                          모임원이 없습니다.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="member-section" style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                참여 멤버 {members.length || 0}
              </h3>
              <div
                className="member-list"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
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
                      {/* 이미지 */}
                      <img
                        src={`${
                          import.meta.env.VITE_AJAX_BASE_URL
                        }/member/image/${member.memberNo}`}
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
                        <ProfilePopover
                          memberNo={member.memberNo}
                          onClose={() => setShowPopoverId(null)}
                        />
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
                    멤버 더보기
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
                    style={{ outline: "none" }}
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
            {/* 신고하기 바텀 시트 */}
            {showReportSheet && (
              <div className="bottom-sheet-content" ref={reportSheetRef}>
                <div className="join-sheet-body">
                  <input
                    type="text"
                    placeholder="신고 내용을 입력하세요"
                    style={{ outline: "none" }}
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    maxLength={100}
                  />
                  <button className="join-btn" onClick={handleReportSubmit}>
                    신고하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
