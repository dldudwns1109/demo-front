import { useCallback, useRef, useState } from "react";

export default function MeetingCreate() {
  //state
  const [meeting, setMeeting] = useState({
    meetingNo: "",
    meetingCrewNo:"",
    meetingOwnerId: "",
    meetingName: "",
    meetingDate: "",
    meetingLocation: "",
    meetingPrice: "",
    meetingLimit: "",
  });
  const [attach, setAttach] = useState(undefined); //파일
  const [previewUrl, setPreviewUrl] = useState(null); //이미지 미리보기

  const fileInputRef = useRef();

  //callback
  const changeMeeting = useCallback((e) => {
    const { name, value } = e.target;
    setMeeting(prev => ({
      ...prev,
      [name]: value
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
  return (
    <>
      {/* 헤더 */}
      {/* <Header/> */}
      <div
        className="d-flex flex-column align-items-center"
        style={{ paddingTop: "70px" }}
      >
        <div style={{ marginBottom: "48px" }}>
          <span
            style={{ fontSize: "24px", fontWeight: "bold", color: "#111111" }}
          >
            정모 추가
          </span>
        </div>
        <div>
          <img
            src={previewUrl || "/images/default.png"}
            onClick={ChangeImage}
            className="memberProfile"
            style={{ cursor: "pointer" }}
          />
        </div>
        <input
          type="file"
          className="form-control"
          name="meetingImg"
          accept=".png, .jpg"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">정모명</label>
          <input
            className="member-input"
            placeholder="정모 이름을 작성해주세요!"
            name="meetingName"
            value={meeting.meetingName}
            onChange={changeMeeting}
          />
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">정모 날짜/시간</label>
          <input
            type="datetime-local"
            className="member-input"
            placeholder="정모 날짜를 작성해주세요!"
            name="meetingDate"
            value={meeting.meetingDate}
            onChange={changeMeeting}
          />
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">정모 위치</label>
          <div
            className="member-input"
            style={{ cursor: "pointer" }}
            onClick={() => setIsPostcodeOpen(true)}> 
            {meeting.meetingLocation || "정모 위치를 검색해주세요!"}
          </div>
            <button
              className="light-gray-btn mt-2"
              style={{ backgroundColor:"#6C757D", color: "#ffffff" }}
            >
              장소 검색하기
            </button>
          </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">정모 비용</label>
          <input
            className="member-input"
            placeholder="정모 비용을 작성해주세요!"
            name="meetingPrice"
            value={meeting.meetingPrice}
            onChange={changeMeeting}
          />
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom: "48px" }}>
          <label className="label-text">인원 수</label>
          <select
            className="form-control"
            name="meetingLimit"
            value={meeting.meetingLimit}
            onChange={changeMeeting}
          />
        </div>
        <div style={{ width: "360px", margin: "0 auto" }}>
          <button className="light-gray-btn">정모 추가하기</button>
        </div>
      </div>
    </>
  );
}
