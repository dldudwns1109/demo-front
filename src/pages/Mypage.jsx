import "../css/Mypage.css";
import Header from "../components/Header";
import { useCallback, useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userIdState } from "../utils/storage";

export default function Mypage() {
  //recoil
  // const userId = useRecoilValue(userIdState);
  const userId = "testuser1";

  //state
  const [member, setMember] = useState(null);//회원정보
  const [createList, setCreateList] = useState([]); //만든모임
  const [joinList, setJoinList] = useState([]); //가입한모임
  const [likeGroupList, setLikeGroupList] = useState([]); //찜한모임
  const [meetingList, setMeetingList] = useState([]); //정모일정
  const [activeTab, setActiveTab] = useState("create"); //현재탭상태

  //effect
  useEffect(() => {
    const dummyMember = {
      memberId: "testuser1",
      memberNickname: "홍길동",
      mbti: "INTP",
      location: "서울",
      school: "KH정보교육원",
      birth: "1997-03-21",
      statusMessage: "새로운 모임을 찾는 중이에요!",
      likeList: ["독서", "여행", "코딩"], // 수정 포인트!
      profileImageUrl: "", // 추가로 이미지 있으면 여기
    };
    setMember(dummyMember);
    // loadMember();
    // loadCreateList();
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
    setLikeGroupList(list);
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
  if (tab === "like" && likeGroupList.length === 0) loadLikeGroupList();
  if (tab === "meeting" && meetingList.length === 0) loadMeetingList();
}, [createList, joinList, likeGroupList, meetingList, loadCreateList, loadJoinList, loadLikeList, loadMeetingList]);

  
  //view
  return (
    <>
      {/* 헤더 */}
      {/* <Header/> */}
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
          likeGroupList.length > 0 ? (
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
