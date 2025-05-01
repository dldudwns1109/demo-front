import { useCallback, useRef, useState } from "react";
import Header from "../components/Header";
import axios from "axios";

const likeList = [
  "스포츠",
  "사교",
  "독서",
  "여행",
  "음악",
  "게임",
  "공연",
  "자기계발",
  "요리",
];
const locationList = [
  "김포시", 
  "서울시", 
  "대전시"
];
const crewLimitList = Array.from({ length: 20 }, (_, i) => 5 * (i + 1));
export default function CrewCreate() {
  //state
  const [crew, setCrew] = useState({
    crewNo: "",
    crewName: "",
    crewCategory: "",
    crewLocation: "",
    crewLimit: 5,
    crewIntro: "",
  });
  const [totalPrice, setTotalPrice] = useState(1000);//결제 금액
  const [attach, setAttach] = useState(undefined);//파일
  const [previewUrl, setPreviewUrl] = useState(null);//이미지 미리보기

  const fileInputRef = useRef();

  //callback
  const changeCrew = useCallback((e) => {
    const { name, value } = e.target;
    setCrew(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const changeCrewLimit = useCallback((e) => {
    const value = parseInt(e.target.value);
    setCrew(prev => ({
      ...prev,
      crewLimit: value,
    }));
    setTotalPrice(Math.ceil(value / 5) * 1000);
  }, []);

  const changeCrewCategory = useCallback((like) => {
    setCrew(prev => ({
      ...prev,
      crewCategory: like,
    }));
  }, []);

  // 이미지 클릭 시 파일 선택창 열기
  const ChangeImage = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);
  

  // 파일 선택 시 파일 객체 저장
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setAttach(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const isCrewValid = useCallback(() => {
    return (
      crew.crewName.trim() !== "" &&
      crew.crewIntro.trim() !== "" &&
      crew.crewLocation !== "" &&
      crew.crewCategory !== ""
    );
  }, [crew]);

  //결제 성공 후 모임 생성
  const createCrew = useCallback(async () => {
    try {
      const crewData = {
        crewDto: crew,             // 모임 정보 (이름, 소개글 등)
        totalAmount: totalPrice    // 인원 수에 따른 결제 금액
      };
  
      const res = await axios.post("http://localhost:8080/api/pay/ready", crewData);
      console.log("🟢 카카오페이 응답:", res.data);

      const redirectUrl = res.data?.next_redirect_pc_url;
      // 카카오페이 결제 페이지로 이동
      if (!redirectUrl) {
        console.error("❌ redirect URL이 유효하지 않음:", redirectUrl);
        alert("결제 페이지로 이동할 수 없습니다.");
        return;
      }
  
      // ✅ 실제 결제창으로 이동
      window.location.href = redirectUrl;
  
    } catch (error) {
      console.error("결제 준비 중 오류", error);
      alert("모임 생성(결제) 요청에 실패했습니다.");
    }
  }, [crew, totalPrice]);
  
  //view
  return (
    <>
      {/* 헤더 */}
      {/* <Header/> */}
      <div
        className="d-flex flex-column align-items-center"
        style={{ paddingTop: "70px" }}>
        <div style={{ marginBottom: "48px" }}>
          <span
            style={{ fontSize: "24px", fontWeight: "bold", color: "#111111" }}
          >
            모임 개설
          </span>
        </div>
        <div>
          <img
            src={previewUrl || "/images/default-profile.svg"}
            onClick={ChangeImage}
            className="memberProfile"
            style={{ cursor: "pointer" }}
          />
        </div>
        <input type="file" className="form-control"
          name="crewImg"
          accept=".png, .jpg"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
          />

        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">모임명</label>
          <input className="member-input" 
            placeholder="모임 이름을 작성해주세요!"
            name="crewName"
            value={crew.crewName}
            onChange={changeCrew}>
            </input>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">모임 소개</label>
          <textarea style={{ width: "360px", height:"155px", margin: "0 auto" }}
            placeholder="모임을 소개하는 글을 작성해주세요!"
            name="crewIntro"
            value={crew.crewIntro}
            onChange={changeCrew}/>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">활동 지역</label>
          <select className="form-control"
              name="crewLocation" 
              value={crew.crewLocation}
              onChange={changeCrew}
            >
              <option value="">선택하세요</option>
                {locationList.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">관심사</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "24px",
            }}
          >
            {likeList.map((like) => (
              <button
                key={like}
                className={`mbti-badge ${crew.crewCategory === like ? "active" : ""}`}
                onClick={() => changeCrewCategory(like)}
                type="button"
              >
                {like}
              </button>
            ))}
          </div>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom: "48px" }}>
          <label className="label-text">인원 수</label>
          <p style={{ fontSize: "14px", color:"#6C757D", marginBottom: "8px" }}>* 인원 수에 따라 결제 금액이 상이할 수 있습니다</p>
          <select 
            className="form-control"
            name="crewLimit"
            value={crew.crewLimit}
            onChange={changeCrewLimit}
          >
            {crewLimitList.map((count) => (
              <option key={count} value={count}>{count}명</option>
            ))}
          </select>
          <p> 
            최종 금액 
            <span className="ms-1" style={{ color: "#dc3545", fontWeight: "bold" }}>[{totalPrice.toLocaleString()}]</span>원
          </p>
        </div>
        <div style={{ width: "360px", margin: "0 auto" }}>
        <button
          className={isCrewValid() ? "blue-btn" : "light-gray-btn"}
          onClick={createCrew}
          disabled={!isCrewValid()}
        >
          모임개설하기
        </button>
        </div>
      </div>
    </>
  );
}