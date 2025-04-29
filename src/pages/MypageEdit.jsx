import "../css/Mypage.css";
import Header from "../components/Header";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

const likeList = ["스포츠", "사교", "독서", "여행", "음악", "게임", "공연", "자기계발", "요리"];
const mbtiList = ["ISFJ", "ISTJ", "ESTJ", "ESFJ", "ENFJ", "ENTJ", "INTJ", "INFJ", "ENFP", "ENTP", "INTP", "INFP", "ESFP", "ESTP", "ISTP", "ISFP"];
const locationList = ["김포시", "서울시", "대전시"];
const schollList = ["가톨릭대학교", "고려대학교", "연세대학교"];
export default function MypageEdit() {
  const navigate = useNavigate();

  //state
  const [selectedLikeList, setSelectedLikeList] = useState([]);
  const [selectedMbti, setSelectedMbti] = useState("");

  //callbacks
  const clickLikeBtn = useCallback((like) => {
    setSelectedLikeList((prev) => 
      prev.includes(like) ? 
      prev.filter(i => i !== like) : [...prev, like]
    );
  }, []);

  const clickMbtiBtn = useCallback((mbti) => {
    setSelectedMbti(mbti);
  }, []);

  //view
  return (
    <>
      {/* 헤더 */}
      {/* <Header/> */}
      {/* 수정 페이지 */}
      <div className="d-flex flex-column align-items-center" style={{ marginTop:"80px" }}>
        <div style={{ marginBottom:"48px" }}>
          <span style={{ fontSize: "24px", fontWeight: "bold", color: "#111111" }}>
            개인정보수정
          </span>
        </div>
        <div >
          <img className="memberProfile"/>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom:"16px"}}>
          <label className="label-text">
            아이디
          </label>

          <input className="member-input"/>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom:"16px"}}>
        <label className="label-text">
            닉네임
          </label>

          <input className="member-input"/>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom:"16px"}}>
          <label className="label-text">
            비밀번호
          </label>
          <button className="light-gray-btn" style={{ backgroundColor:"#6C757D", color: "#ffffff" }}
              onClick={() => navigate("/mypage/edit/password")}>
            비밀번호 변경하기
          </button>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom:"16px"}}>
          <label className="label-text">
            이메일
          </label>

          <input type="text" className="member-input"/>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom:"16px"}}>
          <label className="label-text">
            생년월일
          </label>

          <input type="text" className="member-input"/>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom:"16px" }}>
          <label className="label-text">
            성별
          </label>

          <div className="d-flex">
            <input 
              type="radio" 
              name="memberGender" 
              value="M"
              style={{ width: "20px", height: "20px" }} 
            />
            <label style={{ marginLeft: "8px", marginBottom: "0", marginRight: "10px" }}>
              남자
            </label>

            <input 
              type="radio" 
              name="memberGender" 
              value="F"
              style={{ width: "20px", height: "20px" }} 
            />
            <label style={{ marginLeft: "8px" }}>
              여자
            </label>
          </div>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom:"16px"}}>
          <label className="label-text">
            거주지
          </label>

            <select className="form-control" name="memberLocation">
              <option value="">선택하세요</option>
                {locationList.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
          <div style={{ width: "360px", margin: "0 auto", marginBottom:"16px"}}>
            <label className="label-text">
              재학중인 학교
            </label>

            <select className="form-control" name="memberSchool">
              <option value="">선택하세요</option>
                {schollList.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom:"16px"}}>
          <label className="label-text">
            관심사
          </label>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
            {likeList.map((like) => (
              <button
                key={like}
                className={`mbti-badge ${selectedLikeList.includes(like) ? "active" : ""}`}
                onClick={() => clickLikeBtn(like)}
                type="button">
              {like}
            </button>
            ))}
          </div>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom:"48px"}}>
          <label className="label-text">
            MBTI
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
            {mbtiList.map((mbti) => (
              <button
                key={mbti}
                className={`mbti-badge ${selectedMbti === mbti ? "active" : ""}`}
                onClick={() => clickMbtiBtn(mbti)}
                type="button">
              {mbti}
            </button>
            ))}
          </div>
        </div>
      <div style={{ width: "360px", margin: "0 auto" }}>
        <button className="blue-btn">
            수정하기
        </button>
      </div>
    </>
  );
}
