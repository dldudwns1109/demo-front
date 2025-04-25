import "../css/Mypage.css";
import Header from "../components/Header";
import { useCallback, useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";

export default function Mypage() {
  // 테스트용 유저 ID
  const userId = 1;

  // 테스트용 유저 정보
  const user = {
    name: "김진영",
    mbti: "ISFJ",
    location: "서울시",
    school: "고려대학교",
    birth: "2001.04.02",
    statusMessage: "파이널 프로젝트 어렵잖아!",
    likeList: ["스포츠", "사교", "게임", "음악"],
  };

  //state
  const [createList, setCreateList] = useState([]); //만든모임
  const [joinList, setJoinList] = useState([]); //가입한모임
  const [likeList, setLikeList] = useState([]); //찜한모임
  const [meetingList, setMeetingList] = useState([]); //정모일정
  const [activeTab, setActiveTab] = useState("create"); //현재탭상태

  //callback
  //목록 로딩 함수들
  const loadCreateList = useCallback(async () => {
    const resp = await axios.get(`/crew/created/${userId}`);
    setCreateList(resp.data);
  }, [userId]);

  const loadJoinList = useCallback(async () => {
    const resp = await axios.get(`/crew/joined/${userId}`);
    setJoinList(resp.data);
  }, [userId]);

  const loadLikeList = useCallback(async () => {
    const resp = await axios.get(`/crew/liked/${userId}`);
    setLikeList(resp.data);
  }, [userId]);

  const loadMeetingList = useCallback(async () => {
    const resp = await axios.get(`/meeting/member/${userId}`);
    setMeetingList(resp.data);
  }, [userId]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    // 선택된 탭에 맞는 목록을 필요한 경우만 불러오기
    if (tab === "join" && joinList.length === 0) loadJoinList();
    if (tab === "like" && likeList.length === 0) loadLikeList();
    if (tab === "meeting" && meetingList.length === 0) loadMeetingList();
  },[joinList,likeList,meetingList,loadJoinList,loadLikeList,loadMeetingList]);

  //effect
  useEffect(() => {
    loadCreateList();
  }, []);

  //view
  return (
    <>
      {/* 헤더 */}
      <Header/>
      {/* 마이페이지 프로필 */}
      <ProfileCard user={user}/>

      {/* 모임 탭 메뉴 */}
      <div className="group-tab-container">
        <button className={`group-tab-button${activeTab === "create" ? " active" : ""}`}
          onClick={() => handleTabClick("create")}>
          만든 모임
        </button>
        <button className={`group-tab-button${activeTab === "join" ? " active" : ""}`}
          onClick={() => handleTabClick("join")}>
          가입한 모임
        </button>
        <button className={`group-tab-button${activeTab === "like" ? " active" : ""}`}
          onClick={() => handleTabClick("like")}>
          찜한 모임
        </button>
        <button className={`group-tab-button${activeTab === "meeting" ? " active" : ""}`}
          onClick={() => handleTabClick("meeting")}>
          정모 일정
        </button>
      </div>

      {/* 모임 목록 출력 */}
      <div className="group-tab-content mt-4">
        {activeTab === "create" && (
          createList.length > 0 ? (
            <div className="d-flex flex-wrap gap-4 justify-content-start">
              {createList.map((crew) => <CrewCard key={crew.id} crew={crew} />)}
            </div>
          ) : (
            <div className="empty-message">만든 모임이 없습니다.</div>
          )
        )}

        {activeTab === "join" && (
          joinList.length > 0 ? (
            <div className="d-flex flex-wrap gap-4 justify-content-start">
              {joinList.map((crew) => <CrewCard key={crew.id} crew={crew} />)}
            </div>
          ) : (
            <div className="empty-message">가입한 모임이 없습니다.</div>
          )
        )}

        {activeTab === "like" && (
          likeList.length > 0 ? (
            <div className="d-flex flex-wrap gap-4 justify-content-start">
              {likeList.map((crew) => <CrewCard key={crew.id} crew={crew} />)}
            </div>
          ) : (
            <div className="empty-message">찜한 모임이 없습니다.</div>
          )
        )}

        {activeTab === "meeting" && (
          meetingList.length > 0 ? (
            <div className="d-flex flex-wrap gap-4 justify-content-start">
              {meetingList.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
            </div>
          ) : (
            <div className="empty-message">정모 일정이 없습니다.</div>
          )
        )}
      </div>
    </>
  );
}
