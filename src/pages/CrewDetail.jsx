import { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { loginState, locationState } from "../utils/storage";
import Header from "../components/Header";
import CrewTopNav from "../components/CrewTopNav";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaShareAlt, FaExclamationTriangle } from "react-icons/fa";
import "../css/CrewDetail.css";

export default function CrewDetail() {
  const login = useRecoilValue(loginState);
  const [location, setLocation] = useRecoilState(locationState);
  const { crewNo } = useParams();

  const [crewData, setCrewData] = useState(null);
  const [members, setMembers] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [crewImage, setCrewImage] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [showReportInput, setShowReportInput] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const [reportMessage, setReportMessage] = useState("");

   /* 모임 기본 정보 불러오기 (로그인 여부와 무관하게 항상 실행) */
   useEffect(() => {
    const fetchCrewData = async () => {
      try {
        const crewRes = await axios.get(`http://localhost:8080/api/crew/${crewNo}`);
        setCrewData(crewRes.data);
      } catch (err) {
        console.error("Error fetching crew data:", err.message);
      }
    };

    const fetchMembers = async () => {
      try {
        const membersRes = await axios.get(`http://localhost:8080/api/crewmember/${crewNo}/members`);
        setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
      } catch (err) {
        console.error("Error fetching members data:", err.message);
      }
    };

    fetchCrewData();
    fetchMembers();
  }, [crewNo]);

  

  /* 로그인 시 추가적으로 체크할 정보들 */
  useEffect(() => {
    if (!login) return;

    const fetchMemberStatus = async () => {
      try {
        const token = localStorage.getItem("refreshToken");
        const headers = { Authorization: `Bearer ${token}` };

        const memberRes = await axios.get(`http://localhost:8080/api/crewmember/${crewNo}/member`, {
          headers,
        });
        setIsMember(memberRes.data);

        const leaderRes = await axios.get(`http://localhost:8080/api/crewmember/${crewNo}/leader`, {
          headers,
        });
        setIsLeader(leaderRes.data);

        const likeRes = await axios.get(`http://localhost:8080/api/crewmember/${crewNo}/like`, {
          headers,
        });
        setIsLiked(likeRes.data);
      } catch (err) {
        console.error("Error fetching member status:", err.message);
      }
    };

    fetchMemberStatus();
  }, [login, crewNo]);

  const handleJoin = () => {
    setShowJoinInput(true);
  };

  const handleReport = () => {
    setShowReportInput(true);
  };

  const handleHeartClick = () => {
    if (!login) {
      window.confirm("비회원은 사용할 수 없는 기능입니다.");
      return;
    }
    setIsLiked(!isLiked);
  };

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
          <div className="crew-image-section">
            <img
              src={crewImage || "/images/dummy-crew.jpg"}
              alt="Crew"
              className="crew-image"
            />
            <div className="action-buttons">
              <button
                className="action-btn share-btn"
                style={{ padding: "0.2rem 0.4rem" }}
              >
                <FaShareAlt /> 공유하기
              </button>

              <button
                className="action-btn report-btn"
                style={{ padding: "0.2rem 0.4rem" }}
                onClick={handleReport}
              >
                <FaExclamationTriangle /> 신고하기
              </button>

              {login && !isMember && (
                <button
                  className="action-btn join-btn"
                  style={{ padding: "0.2rem 0.4rem" }}
                  onClick={handleJoin}
                >
                  가입하기
                </button>
              )}

              {login && isMember && !isLeader && (
                <button
                  className="action-btn leave-btn"
                  style={{ padding: "0.2rem 0.4rem" }}
                >
                  탈퇴하기
                </button>
              )}

              {login && isLeader && (
                <>
                  <button
                    className="action-btn edit-btn"
                    style={{ padding: "0.2rem 0.4rem" }}
                  >
                    모임 수정
                  </button>

                  <button
                    className="action-btn delete-btn"
                    style={{ padding: "0.2rem 0.4rem" }}
                  >
                    모임 해체
                  </button>
                </>
              )}

              <button
                className={`action-btn heart-btn ${isLiked ? "liked" : ""}`}
                style={{ padding: "0.2rem 0.4rem" }}
                onClick={handleHeartClick}
              >
                <FaHeart />
              </button>
            </div>
          </div>

          <div className="crew-intro">
            <h2>{crewData?.crewName}</h2>
            <p>{crewData?.crewIntro}</p>
          </div>

          <div className="member-section">
            <h3>모임 멤버</h3>
            <div className="member-list">
              {Array.isArray(members) && members.length > 0 ? (
                members.map((member) => (
                  <div key={member.memberNo} className="member-item">
                    <p>{member.memberNo}</p>
                  </div>
                ))
              ) : (
                <p>가입된 멤버가 없습니다.</p>
              )}
            </div>
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
