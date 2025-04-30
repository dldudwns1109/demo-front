import { useCallback, useRef, useState } from "react";
import Header from "../components/Header";

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
export default function GroupCreate() {
  //state
  const [selectedLikeList, setSelectedLikeList] = useState("");
  const [crewLimit, setCrewLimit] = useState(5);
  const [totalPrice, setTotalPrice] = useState(1000);
  const [attach, setAttach] = useState(undefined);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef();

  //callback
  const clickLikeBtn = useCallback((like) => {
    setSelectedLikeList(like);
  }, []);

  const changeCrewLimit = useCallback((e) => {
    const count = parseInt(e.target.value);
    setCrewLimit(count);
    setTotalPrice(Math.ceil(count / 5) * 1000);
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
            src={previewUrl || "/images/default.png"}
            onClick={ChangeImage}
            className="memberProfile"
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
            name="crewName">

            </input>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">모임 소개</label>
          <textarea style={{ width: "360px", height:"125px", margin: "0 auto" }}
            placeholder="모임을 소개하는 글을 작성해주세요!"
            name="crewIntro">

          </textarea>
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">활동 지역</label>
          <select className="form-control" 
              name="crewLocation">
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
                className={`mbti-badge ${
                  selectedLikeList.includes(like) ? "active" : ""
                }`}
                onClick={() => clickLikeBtn(like)}
                type="button"
                name="crewCategory"
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
            value={crewLimit}
            onChange={changeCrewLimit}
            style={{ marginBottom: "8px" }}
            >
              {crewLimitList.map((count) => (
              <option key={count} value={count}>
                {count}명
              </option>
            ))}
          </select>
          <p> 
            최종 금액 
            <span className="ms-1" style={{ color: "#dc3545", fontWeight: "bold" }}>[{totalPrice.toLocaleString()}]</span>원
          </p>
        </div>
        <div style={{ width: "360px", margin: "0 auto" }}>
          <button className="light-gray-btn">모임개설하기</button>
        </div>
      </div>
    </>
  );
}