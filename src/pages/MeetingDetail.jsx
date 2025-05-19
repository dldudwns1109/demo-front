import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import axios from "axios";
import Header from "../components/Header";
import { userNoState } from "../utils/storage";
import { toast, ToastContainer } from "react-toastify";
import MeetingDelegateModal from "../components/DelegateModal";
import {
  FaLocationDot,
  FaRegCalendar,
  FaClock,
  FaWonSign,
} from "react-icons/fa6";
import Unauthorized from "../components/Unauthorized";
import ProfilePopover from "../components/ProfilePopover";

export default function MeetingDetail() {
  // URL 파라미터로 crewNo, meetingNo 획득
  const { crewNo, meetingNo } = useParams();
  const navigate = useNavigate();

  // Recoil에서 userNo만 사용, 로그인은 로컬스토리지 토큰으로
  const userNo = useRecoilValue(userNoState);
  const login = Boolean(localStorage.getItem("accessToken"));

  // 상태들
  const [meeting, setMeeting] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isDelegating, setIsDelegating] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPopoverId, setShowPopoverId] = useState(null);
  const [isMeetingLeader, setIsMeetingLeader] = useState(false);

  // 인원 초과 체크
  const isFull = useMemo(
    () => meeting && memberList.length >= meeting.meetingLimit,
    [meeting, memberList]
  );

  // 1) 회의 상세 조회
  const fetchMeetingDetail = useCallback(() => {
    axios
      .get(`http://localhost:8080/api/meeting/${meetingNo}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => setMeeting(res.data))
      .catch((err) => {
        console.error("정모 정보 조회 실패", err);
        if (err.response?.status === 403) {
          if (
            window.confirm(
              "모임 회원만 이용 가능합니다."
            )
          ) {
            return navigate(-1);
          }
          return navigate(-1);
        }
        if (err.response?.status === 404) {
          toast.error("삭제된 정모입니다.");
          setErrorMessage("삭제된 정모이거나 존재하지 않는 페이지입니다.");
          setUnauthorized(true);
          return;
        }
        toast.error("정모 정보를 불러오는 중 오류가 발생했습니다.");
        setErrorMessage("정모 정보를 불러오는 중 오류가 발생했습니다.");
        setUnauthorized(true);
      });
  }, [meetingNo, crewNo, navigate]);

  // 2) 참여자 목록 조회
  const fetchMeetingMemberList = useCallback(() => {
    axios
      .get(`http://localhost:8080/api/meetingMember/${meetingNo}`)
      .then((res) => {
        setMemberList(res.data);
        const me = res.data.find((m) => m.memberNo === userNo);
        setIsMeetingLeader(me?.isLeader === "Y");
      })
      .catch((err) => console.error("참여자 목록 조회 실패", err));
  }, [meetingNo, userNo]);

  // 3) 참여 여부 확인
  const checkMeetingJoin = useCallback(() => {
    axios
      .get(`http://localhost:8080/api/meetingMember/${meetingNo}/check`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => setIsJoined(res.data))
      .catch((err) => console.error("참여 여부 확인 실패", err));
  }, [meetingNo]);

  // 4) 참여, 탈퇴, 삭제
  const meetingJoin = useCallback(() => {
    axios
      .post(
        `http://localhost:8080/api/meetingMember/`,
        { meetingNo },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(() => {
        setIsJoined(true);
        fetchMeetingMemberList();
      })
      .catch((err) => console.error("정모 참여 실패", err));
  }, [meetingNo, fetchMeetingMemberList]);

  const meetingExit = useCallback(() => {
    axios
      .delete(`http://localhost:8080/api/meetingMember/${meetingNo}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(() => {
        setIsJoined(false);
        fetchMeetingMemberList();
      })
      .catch((err) => console.error("정모 나가기 실패", err));
  }, [meetingNo, fetchMeetingMemberList]);

  const meetingDelete = useCallback(() => {
    if (!window.confirm("정말로 이 정모를 삭제하시겠습니까?")) return;
    axios
      .delete(`http://localhost:8080/api/meeting/${meetingNo}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(() => {
        toast.success("정모가 삭제되었습니다.");
        navigate(crewNo ? `/crew/${crewNo}/detail` : -1);
      })
      .catch((err) => {
        console.error("정모 삭제 실패", err);
        toast.error("정모 삭제 중 오류가 발생했습니다.");
      });
  }, [meetingNo, crewNo, navigate]);

  // 초기 데이터 로드
  useEffect(() => {
    if (!login) return;
    fetchMeetingDetail();
    fetchMeetingMemberList();
    checkMeetingJoin();
  }, [login, fetchMeetingDetail, fetchMeetingMemberList, checkMeetingJoin]);

  // 로그인 강제 리다이렉트
  useEffect(() => {
    if (!login) {
      if (
        window.confirm(
          "로그인이 필요한 기능입니다. 로그인 페이지로 이동할까요?"
        )
      ) {
        navigate("/signin");
      } else {
        navigate(crewNo ? `/crew/${crewNo}/detail` : -1);
      }
    }
  }, [login, crewNo, navigate]);

  // 렌더링 분기
  if (!login) return null;
  if (unauthorized) {
    return (
      <div className="vh-100">
        <Header input={false} loginState="login" />
        <Unauthorized message={errorMessage} />
      </div>
    );
  }
  if (!meeting) return null;

  // 날짜/시간 포맷팅
  const dateObj = new Date(meeting.meetingDate);
  const dateStr = dateObj.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const timeStr = dateObj.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Header loginState="loggedIn" input={false} />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        pauseOnHover={false}
        limit={1}
      />

      {isDelegating && (
        <MeetingDelegateModal
          memberList={memberList}
          userNo={userNo}
          selectedMember={selectedMember}
          setSelectedMember={setSelectedMember}
          onClose={() => setIsDelegating(false)}
          onDelegate={async () => {
            if (!selectedMember) return;
            try {
              await axios.put(
                `http://localhost:8080/api/meeting/${meetingNo}/owner`,
                null,
                {
                  params: { newOwnerNo: selectedMember.memberNo },
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken"
                    )}`,
                  },
                }
              );
              toast.success("모임장 위임이 완료되었습니다.");
              setIsDelegating(false);
              setSelectedMember(null);
              fetchMeetingMemberList();
              fetchMeetingDetail();
            } catch (err) {
              console.error("모임장 위임 실패", err);
              toast.error("모임장 위임 중 오류 발생");
            }
          }}
        />
      )}

      <div>
        {meeting.attachmentNo && (
          <img
            src={`http://localhost:8080/api/meeting/image/${meetingNo}`}
            alt="정모 이미지"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: 400,
              objectFit: "cover",
              marginBottom: 24,
            }}
          />
        )}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          {/* 상단 타이틀 & 버튼 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
              marginBottom: "24px",
              flexWrap: "wrap", // ① 줄바꿈 허용
              minWidth: 0, // flex item이 너무 작아지는 걸 방지
            }}
          >
            <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#333" }}>
              {meeting.meetingName}
            </h1>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
                onClick={() => {
                  return navigate(-1);
                }}
              >
                뒤로가기
              </button>
              {isMeetingLeader && (
                <>
                  <button
                    style={{
                      backgroundColor: "#007BFF",
                      color: "#fff",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                    onClick={() => navigate(`/meeting/edit/${meetingNo}`)}
                  >
                    수정
                  </button>
                  <button
                    style={{
                      backgroundColor: "#DC3545",
                      color: "#fff",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                    onClick={meetingDelete}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 날짜 */}
          <div style={{ marginTop: "40px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#6C757D",
                  }}
                >
                  <FaRegCalendar size={20} />
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#333333",
                    lineHeight: "1",
                  }}
                >
                  정모 날짜
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
              {dateStr}
            </p>
          </div>

          {/* 시간 */}
          <div style={{ marginTop: "36px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#6C757D",
                  }}
                >
                  <FaClock size={20} />
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#333333",
                    lineHeight: "1",
                  }}
                >
                  정모 시간
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
              {timeStr}
            </p>
          </div>

          {/* 장소 */}
          <div style={{ marginTop: "36px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#6C757D",
                  }}
                >
                  <FaLocationDot size={20} />
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#333333",
                    lineHeight: "1",
                  }}
                >
                  정모 위치
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
              {meeting.meetingLocation}
            </p>
          </div>

          {/* 비용 */}
          <div style={{ marginTop: "36px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#6C757D",
                  }}
                >
                  <FaWonSign size={20} />
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#333333",
                    lineHeight: "1",
                  }}
                >
                  인당 비용
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
              {Number(meeting.meetingPrice).toLocaleString()}원
            </p>
          </div>

          {/* 참여/위임 버튼 */}
          <div style={{ marginTop: "64px" }}>
            {isMeetingLeader ? (
              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#F9B4ED",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const delegateTargetList = memberList.filter(
                    (m) => m.isLeader !== "Y"
                  );
                  if (delegateTargetList.length === 0) {
                    toast.warn("위임할 대상이 없습니다.");
                    return;
                  }
                  setIsDelegating(true);
                }}
              >
                모임장 위임하기
              </button>
            ) : isJoined ? (
              <button
                onClick={meetingExit}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#f1f3f5",
                  color: "#6c757d",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                정모 나가기
              </button>
            ) : (
              <button
                onClick={() => {
                  if (isFull) {
                    toast.warning("정원이 다 찼습니다.");
                    return;
                  }
                  meetingJoin();
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#007BFF",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                정모 참여하기
              </button>
            )}
          </div>

          {/* 참여자 목록 */}
          <div style={{ marginTop: "80px" }}>
            <h3
              style={{
                marginBottom: "36px",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              참여 멤버 {memberList.length} / {meeting.meetingLimit}
            </h3>
            {memberList.map((member) => (
              <div
                key={member.memberNo}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "18px",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                  }}
                >
                  <img
                    src={
                      member.attachmentNo
                        ? `http://localhost:8080/api/attachment/${member.attachmentNo}`
                        : "/images/default-profile.png"
                    }
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "12px",
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
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {member.memberNickname}
                  </span>
                  {member.isLeader === "Y" && (
                    <span
                      style={{
                        color: "#F9B4ED",
                        padding: "2px 6px",
                        borderRadius: "8px",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      모임장
                    </span>
                  )}
                </div>
                {showPopoverId === member.memberNo && (
                  <ProfilePopover
                    memberNo={member.memberNo}
                    onClose={() => setShowPopoverId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
