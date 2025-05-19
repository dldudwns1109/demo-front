import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import axios from "axios";
import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import GroupItem from "../components/GroupItem";
import Unauthorized from "../components/Unauthorized";
import { userNoState, loginState, windowWidthState } from "../utils/storage";

import "../css/Mypage.css";
import GroupMeetingCard from "../components/GroupMeetingCard";

export default function Mypage() {
  const windowWidth = useRecoilValue(windowWidthState);
  const userNo = useRecoilValue(userNoState);
  const login = useRecoilValue(loginState);

  const [member, setMember] = useState(null);
  const [createList, setCreateList] = useState([]);
  const [joinList, setJoinList] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [meetingList, setMeetingList] = useState([]);
  const [activeTab, setActiveTab] = useState("create");

  useEffect(() => {
    loadMember();
    loadCreateList();
  }, [userNo]);

  const loadMember = useCallback(async () => {
    if (!userNo) return;
    const res = await axios.get(`/member/mypage/${userNo}`);
    setMember(res.data);
  }, [userNo]);

  const loadCreateList = useCallback(async () => {
    if (!userNo) return;
    const res = await axios.get(`/crew/findCreatedGroup/${userNo}`);
    const list = Array.isArray(res.data) ? res.data : [];
    setCreateList(list);
  }, [userNo]);

  const loadJoinList = useCallback(async () => {
    if (!userNo) return;
    const res = await axios.get(`/crew/findJoinedGroup/${userNo}`);
    const list = Array.isArray(res.data) ? res.data : [];
    setJoinList(list);
  }, [userNo]);

  const loadLikeGroupList = useCallback(async () => {
    const res = await axios.get(`/crew/findLikeGroup/${userNo}`);
    const list = Array.isArray(res.data) ? res.data : [];
    setLikeList(list);
  }, [userNo]);

  const loadMeetingList = useCallback(async () => {
    const res = await axios.get(`/meeting/crew/${userNo}`);
    const list = Array.isArray(res.data) ? res.data : [];
    setMeetingList(list);
  }, [userNo]);

  const handleTabClick = useCallback(
    (tab) => {
      setActiveTab(tab);
      if (tab === "create") loadCreateList();
      if (tab === "join") loadJoinList();
      if (tab === "like") loadLikeGroupList();
      if (tab === "meeting") loadMeetingList();
    },
    [
      createList,
      joinList,
      likeList,
      meetingList,
      loadCreateList,
      loadJoinList,
      loadLikeGroupList,
      loadMeetingList,
    ]
  );

  return (
    <div className="vh-100">
      <Header loginState={`${login ? "loggined" : "login"}`} input={false} />

      {login ? (
        <div style={{ paddingTop: "70px" }}>
          <div style={{ marginTop: "48px" }}>
            <ProfileCard member={member} />
          </div>

          <div
            className="w-100 d-flex justify-content-center align-items-center"
            style={{
              paddingLeft: windowWidth > 768 ? "120px" : "0",
              paddingRight: windowWidth > 768 ? "120px" : "0",
              marginTop: "48px",
              marginBottom: "32px",
            }}
          >
            <button
              className={`group-tab-button ${
                activeTab === "create" ? " active" : ""
              } ${windowWidth < 768 && "fs-6"}`}
              style={{ width: "25%" }}
              onClick={() => handleTabClick("create")}
            >
              만든 모임
            </button>
            <button
              className={`group-tab-button${
                activeTab === "join" ? " active" : ""
              } ${windowWidth < 768 && "fs-6"}`}
              style={{ width: "25%" }}
              onClick={() => handleTabClick("join")}
            >
              가입한 모임
            </button>
            <button
              className={`group-tab-button${
                activeTab === "like" ? " active" : ""
              } ${windowWidth < 768 && "fs-6"}`}
              style={{ width: "25%" }}
              onClick={() => handleTabClick("like")}
            >
              찜한 모임
            </button>
            <button
              className={`group-tab-button${
                activeTab === "meeting" ? " active" : ""
              } ${windowWidth < 768 && "fs-6"}`}
              style={{ width: "25%" }}
              onClick={() => handleTabClick("meeting")}
            >
              정모 일정
            </button>
          </div>

          <div className="group-tab-content" style={{ paddingBottom: "60px" }}>
            {activeTab === "create" &&
              (createList.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `${
                      windowWidth > 1024
                        ? "repeat(3, 1fr)"
                        : windowWidth > 768
                        ? "repeat(2, 1fr)"
                        : "repeat(1, 1fr)"
                    }`,
                    gap: "60px",
                    paddingLeft: windowWidth > 768 ? "120px" : "8.33%",
                    paddingRight: windowWidth > 768 ? "120px" : "8.33%",
                  }}
                >
                  {createList.map((crew, idx) => (
                    <GroupItem key={idx} data={crew} />
                  ))}
                </div>
              ) : (
                <div className="empty-message">만든 모임이 없습니다.</div>
              ))}

            {activeTab === "join" &&
              (joinList.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `${
                      windowWidth > 1024
                        ? "repeat(3, 1fr)"
                        : windowWidth > 768
                        ? "repeat(2, 1fr)"
                        : "repeat(1, 1fr)"
                    }`,
                    gap: "60px",
                    paddingLeft: windowWidth > 768 ? "120px" : "8.33%",
                    paddingRight: windowWidth > 768 ? "120px" : "8.33%",
                  }}
                >
                  {joinList.map((crew, idx) => (
                    <GroupItem key={idx} data={crew} />
                  ))}
                </div>
              ) : (
                <div className="empty-message">가입한 모임이 없습니다.</div>
              ))}

            {activeTab === "like" &&
              (likeList.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `${
                      windowWidth > 1024
                        ? "repeat(3, 1fr)"
                        : windowWidth > 768
                        ? "repeat(2, 1fr)"
                        : "repeat(1, 1fr)"
                    }`,
                    gap: "60px",
                    paddingLeft: windowWidth > 768 ? "120px" : "8.33%",
                    paddingRight: windowWidth > 768 ? "120px" : "8.33%",
                  }}
                >
                  {likeList.map((crew, idx) => (
                    <GroupItem key={idx} data={crew} />
                  ))}
                </div>
              ) : (
                <div className="empty-message">찜한 모임이 없습니다.</div>
              ))}

            {activeTab === "meeting" &&
              (meetingList.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `${
                      windowWidth > 1024
                        ? "repeat(3, 1fr)"
                        : windowWidth > 768
                        ? "repeat(2, 1fr)"
                        : "repeat(1, 1fr)"
                    }`,
                    gap: "60px",
                    paddingLeft: windowWidth > 768 ? "120px" : "8.33%",
                    paddingRight: windowWidth > 768 ? "120px" : "8.33%",
                  }}
                >
                  {meetingList.map((meeting, idx) => (
                    <GroupMeetingCard
                      key={idx}
                      meeting={meeting}
                      crewNo={meeting.meetingCrewNo}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-message">정모 일정이 없습니다.</div>
              ))}
          </div>
        </div>
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}
