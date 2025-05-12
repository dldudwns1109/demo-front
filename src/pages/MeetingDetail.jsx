import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import axios from "axios";
import Header from "../components/Header";
import { loginState, userNoState } from "../utils/storage";

export default function MeetingDetail() {
  const { meetingNo } = useParams();
  const userNo = useRecoilValue(userNoState);
  const login = useRecoilValue(loginState);

  const [meeting, setMeeting] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  // ✅ 정모 정보 조회
  const fetchMeetingDetail = useCallback(() => {
    axios
      .get(`http://localhost:8080/api/meeting/${meetingNo}`)
      .then((res) => setMeeting(res.data))
      .catch((err) => console.error("정모 정보 조회 실패", err));
  }, [meetingNo]);

  // ✅ 참여자 목록 조회
  const fetchMeetingMemberList = useCallback(() => {
    if (!userNo) return;
    axios
      .get(`http://localhost:8080/api/meetingMember/${meetingNo}`)
      .then((res) => setMemberList(res.data))
      .catch((err) => console.error("참여자 목록 조회 실패", err));
  }, [meetingNo, userNo]);

  // ✅ 참여 여부 확인
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

  // ✅ 참여하기
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

  // ✅ 나가기
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

  // ✅ 초기 데이터 로딩
  useEffect(() => {
    fetchMeetingDetail();
    fetchMeetingMemberList();
    checkMeetingJoin();
  }, [fetchMeetingDetail, fetchMeetingMemberList, checkMeetingJoin]);

  // ✅ 날짜 & 시간 포맷
  const dateStr = meeting?.meetingDate?.split("T")[0] || "";
  const timeStr = meeting?.meetingDate?.split("T")[1]?.slice(0, 5) || "";

  return (
    <>
      <Header loginState={`${login ? "loggined" : "login"}`} input={false} />
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
              {userNo === meeting.meetingOwnerNo && (
                <div style={{ display: "flex", gap: "8px" }}>
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
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            {/* 날짜 */}
            <div style={{ marginTop: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <span role="img" aria-label="calendar">
                  📅
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#343a40",
                  }}
                >
                  정모 날짜
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                {dateStr}
              </p>
            </div>

            {/* 시간 */}
            <div style={{ marginTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <span role="img" aria-label="clock">
                  🕒
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#343a40",
                  }}
                >
                  정모 시간
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                {timeStr}
              </p>
            </div>

            {/* 장소 */}
            <div style={{ marginTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <span role="img" aria-label="location">
                  📍
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#343a40",
                  }}
                >
                  정모 위치
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                {meeting.meetingLocation}
              </p>
            </div>

            {/* 비용 */}
            <div style={{ marginTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <span role="img" aria-label="money">
                  💰
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#343a40",
                  }}
                >
                  비용
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                {Number(meeting.meetingPrice).toLocaleString()}원
              </p>
            </div>

            <div style={{ marginTop: "64px" }}>
              {isJoined ? (
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
                  onClick={meetingJoin}
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
                참여 멤버 {memberList.length}
              </h3>
              {memberList.map((member) => (
                <div
                  key={member.memberNo}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
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
                        정모 모임장
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
