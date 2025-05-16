import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import axios from "axios";
import Header from "../components/Header";
import { loginState, userNoState } from "../utils/storage";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import MeetingDelegateModal from "../components/DelegateModal";
import { FaLocationDot, FaRegCalendar } from "react-icons/fa6";
import { FaClock, FaWonSign } from "react-icons/fa";
import Unauthorized from "../components/Unauthorized";
import ProfilePopover from "../components/ProfilePopover";

export default function MeetingDetail() {
  const location = useLocation();
  const crewNo = location.state?.crewNo;
  const { meetingNo } = useParams();
  const userNo = useRecoilValue(userNoState);
  const login = useRecoilValue(loginState);

  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  const [isDelegating, setIsDelegating] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [showPopoverId, setShowPopoverId] = useState(null);

  const [isMeetingLeader, setIsMeetingLeader] = useState(false);

  const isFull = useMemo(() => {
    return meeting && memberList.length >= meeting.meetingLimit;
  }, [meeting, memberList]);

  const fetchMeetingDetail = useCallback(() => {
  axios
    .get(`http://localhost:8080/api/meeting/${meetingNo}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then((res) => {
      setMeeting(res.data);
    })
    .catch((err) => {
      console.error("정모 정보 조회 실패", err);
      if (err.response?.status === 403) {
        alert("해당 모임에 가입한 회원만 정모를 볼 수 있어요.");
      } else if (err.response?.status === 404) {
        alert("삭제된 정모입니다.");
      } else {
        alert("정모 정보를 불러오지 못했습니다.");
      }
      navigate(`/crew/${crewNo}/detail`);
    });
}, [meetingNo, navigate, crewNo]);


  const fetchMeetingMemberList = useCallback(() => {
    if (!userNo) return;
    axios
      .get(`http://localhost:8080/api/meetingMember/${meetingNo}`)
      .then((res) => {
        setMemberList(res.data);
        const myData = res.data.find((m) => m.memberNo === userNo);
        setIsMeetingLeader(myData?.isLeader === "Y");
      })
      .catch((err) => console.error("참여자 목록 조회 실패", err));
  }, [meetingNo, userNo]);

  const checkMeetingJoin = useCallback(() => {
    if (!userNo) return;
    axios
      .get(`http://localhost:8080/api/meetingMember/${meetingNo}/check`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => setIsJoined(res.data))
      .catch((err) => console.error("참여 여부 확인 실패", err));
  }, [meetingNo, userNo]);

  const meetingJoin = useCallback(() => {
    axios
      .post(
        "http://localhost:8080/api/meetingMember/",
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
    const confirmed = window.confirm("정말로 이 정모를 삭제하시겠습니까?");
    if (!confirmed) return;

    axios
      .delete(`http://localhost:8080/api/meeting/${meetingNo}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(() => {
        alert("정모가 삭제되었습니다.");
        navigate(`/crew/${crewNo}/detail`);
      })
      .catch((err) => {
        console.error("정모 삭제 실패", err);
        alert("정모 삭제 중 오류가 발생했습니다.");
      });
  }, [meetingNo, meeting, navigate]);

  useEffect(() => {
  if (!login) {
    const confirmed = window.confirm("로그인이 필요한 기능입니다. 로그인 페이지로 이동할까요?");
    if (confirmed) {
      navigate("/signin");
    } else {
      navigate(`/crew/${crewNo}/detail`);
    }
    return;
  }

  fetchMeetingDetail();
  fetchMeetingMemberList();
  checkMeetingJoin();
}, [fetchMeetingDetail, fetchMeetingMemberList, checkMeetingJoin, login, crewNo, navigate]);


  if (!meeting) return null;
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
      <Header loginState={`${login ? "loggined" : "login"}`} input={false} />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        pauseOnHover={false}
        theme="light"
        limit={1}
      />

      {/* ✅ 위임 모달 */}
      {isDelegating && (
        <MeetingDelegateModal
          memberList={memberList}
          userNo={userNo}
          selectedMember={selectedMember}
          setSelectedMember={setSelectedMember}
          onClose={() => {
            setIsDelegating(false);
            setSelectedMember(null);
          }}
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

              // ✅ 반드시 순서 보장되도록 await로 처리
              await fetchMeetingMemberList();
              await fetchMeetingDetail();
            } catch (err) {
              console.error("모임장 위임 실패", err);
              toast.error("모임장 위임 중 오류 발생");
            }
          }}
        />
      )}

      {/* 로딩 처리 */}
      {meeting === null ? (
        <p style={{ textAlign: "center", padding: "48px", fontSize: "18px" }}>
          정모 정보를 불러오는 중입니다...
        </p>
      ) : (
        <div>
          {meeting.attachmentNo && (
            <img
              src={`http://localhost:8080/api/meeting/image/${meetingNo}`}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "600px",
                objectFit: "cover",
                display: "block",
                marginBottom: "64px",
              }}
            />
          )}
          <div
            style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              {/* 제목 */}
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#333333",
                }}
              >
                {meeting.meetingName}
              </div>

              {/* 버튼 그룹 */}

              <div style={{ display: "flex", gap: "8px" }}>
                {/* ← 모임으로 돌아가기 */}
                <button
                  style={{
                    backgroundColor: "#6c757d",
                    color: "#ffffff",
                    padding: "6px 12px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/crew/${crewNo}/detail`)}
                >
                  모임으로 돌아가기
                </button>
                {isMeetingLeader && (
                  <>
                    <button
                      style={{
                        backgroundColor: "#007BFF",
                        color: "#ffffff",
                        padding: "6px 12px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/meeting/edit/${meetingNo}`)}
                    >
                      수정
                    </button>
                    <button
                      style={{
                        backgroundColor: "#DC3545",
                        color: "#ffffff",
                        padding: "6px 12px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
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
                      lineHeight: "1", // 추가로 균형 잡기
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
                      lineHeight: "1", // 추가로 균형 잡기
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
                      lineHeight: "1", // 추가로 균형 잡기
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
                      lineHeight: "1", // 추가로 균형 잡기
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
                  {/* 팝오버 */}
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
      )}
    </>
  );
}
