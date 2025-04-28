import "../css/Mypage.css";
import Header from "../components/Header";
import { useCallback, useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userIdState } from "../utils/storage";

export default function Mypage() {
  //recoil
  const userId = useRecoilValue(userIdState);

  //state
  const [member, setMember] = useState(null);//회원정보
  const [createList, setCreateList] = useState([]); //만든모임
  const [joinList, setJoinList] = useState([]); //가입한모임
  const [likeList, setLikeList] = useState([]); //찜한모임
  const [meetingList, setMeetingList] = useState([]); //정모일정
  const [activeTab, setActiveTab] = useState("create"); //현재탭상태

  //effect
  useEffect(() => {
    console.log("현재 userId는?", userId); // ✅ 여기 추가
    loadMember();
    loadCreateList();
  }, []);

  //callback
  //목록 로딩 함수들
  const loadMember = useCallback(async () => {
    if (!userId) return;
    const resp = await axios.get(`/member/mypage/${userId}`);
    setMember(resp.data);
  }, [userId]);

  const loadCreateList = useCallback(async () => {
    const resp = await axios.get(`/crew/creat/${userId}`);
    const list = Array.isArray(resp.data) ? resp.data : [];
    setCreateList(list);
  }, [userId]);

  const loadJoinList = useCallback(async () => {
    const resp = await axios.get(`/crew/join/${userId}`);
    const list = Array.isArray(resp.data) ? resp.data : [];
    setJoinList(list);
  }, [userId]);

  const loadLikeList = useCallback(async () => {
    const resp = await axios.get(`/crew/like/${userId}`);
    const list = Array.isArray(resp.data) ? resp.data : [];
    setLikeList(list);
  }, [userId]);

  const loadMeetingList = useCallback(async () => {
    const resp = await axios.get(`/meeting/member/${userId}`);
    const list = Array.isArray(resp.data) ? resp.data : [];
    setMeetingList(list);
  }, [userId]);

const handleTabClick = useCallback((tab) => {
  setActiveTab(tab);
  // 선택된 탭에 맞는 목록을 필요한 경우만 불러오기
  if (tab === "create" && createList.length === 0) loadCreateList();
  if (tab === "join" && joinList.length === 0) loadJoinList();
  if (tab === "like" && likeList.length === 0) loadLikeList();
  if (tab === "meeting" && meetingList.length === 0) loadMeetingList();
}, [createList, joinList, likeList, meetingList, loadCreateList, loadJoinList, loadLikeList, loadMeetingList]);

  
  //view
  return (
    <>
      {/* 헤더 */}
      <Header/>
      {/* 마이페이지 프로필 */}
      <ProfileCard member={member}/>

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
              {/* {createList.map((crew) => <CrewCard key={crew.id} crew={crew} />)} */}
              만든 모임 있습니다
            </div>
          ) : (
            <div className="empty-message">만든 모임이 없습니다.</div>
          )
        )}

        {activeTab === "join" && (
          joinList.length > 0 ? (
            <div className="d-flex flex-wrap gap-4 justify-content-start">
              {/* {joinList.map((crew) => <CrewCard key={crew.id} crew={crew} />)} */}
              가입한 모임 있습니다
            </div>
          ) : (
            <div className="empty-message">가입한 모임이 없습니다.</div>
          )
        )}

        {activeTab === "like" && (
          likeList.length > 0 ? (
            <div className="d-flex flex-wrap gap-4 justify-content-start">
              {/* {likeList.map((crew) => <CrewCard key={crew.id} crew={crew} />)} */}
              찜한 모임 있습니다
            </div>
          ) : (
            <div className="empty-message">찜한 모임이 없습니다.</div>
          )
        )}

        {activeTab === "meeting" && (
          meetingList.length > 0 ? (
            <div className="d-flex flex-wrap gap-4 justify-content-start">
              {/* {meetingList.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)} */}
              정모 일정 있습니다
            </div>
          ) : (
            <div className="empty-message">정모 일정이 없습니다.</div>
          )
        )}
      </div>
    </>
  );
}
