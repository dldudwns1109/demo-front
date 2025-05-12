import { useCallback, useMemo, useRef, useState } from "react";
import PostcodeModal from "../components/PostcodeModal";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

const meetingLimitList = [3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15];
export default function MeetingCreate() {
  const location = useLocation();
  const crewNo = location.state?.crewNo;

  const navigate = useNavigate();

  //state
  const [meeting, setMeeting] = useState({
    meetingName: "",
    meetingDate: "",
    meetingLocation: "",
    meetingPrice: "",
    meetingLimit: 3,
  });
  const [attach, setAttach] = useState(undefined); //파일
  const [previewUrl, setPreviewUrl] = useState(null); //이미지 미리보기
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false); //지도모달
  const fileInputRef = useRef();

  //memo
  const isTotalValid = useMemo(() => {
    return (
      !!meeting.meetingName &&
      !!meeting.meetingDate &&
      !!meeting.meetingLocation &&
      !!meeting.meetingPrice &&
      !!meeting.meetingLimit &&
      !!attach
    );
  }, [meeting, attach]);

  //callback
  const changeMeeting = useCallback((e) => {
    const { name, value } = e.target;

    if (name === "meetingPrice") {
      const numeric = value.replace(/[^0-9]/g, "");
      const withComma = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setMeeting((prev) => ({
        ...prev,
        [name]: withComma,
      }));
      return;
    }

    setMeeting((prev) => ({
      ...prev,
      [name]: value,
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

  //지도모달오픈
  const openPostModal = useCallback((address) => {
    setMeeting((prev) => ({ ...prev, meetingLocation: address }));
  }, []);

  const meetingAdd = useCallback(async () => {
    if (!attach) {
      alert("대표 이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();

    Object.entries(meeting).forEach(([key, value]) => {
      let cleanValue = value;
      if (key === "meetingPrice") {
        cleanValue = value.replaceAll(",", "");
      }
      if (key === "meetingDate") {
        cleanValue = value.replace("T", ""); // ← 이거는 틀림
        // 정확히는 아래와 같이 변환해야 해:
        cleanValue = value.replace("T", " ") + ":00";
      }
      formData.append(key, cleanValue);
    });

    // 반드시 crewNo 추가!
    formData.append("crewNo", crewNo);
    formData.append("attach", attach);

    // 디버깅 로그
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/meeting/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Refresh-Token": localStorage.getItem("refreshToken"),
            "Frontend-URL": "http://localhost:5173",
          },
        }
      );

      const meetingNo = response.data.meetingNo;
      navigate(`/meeting/detail/${meetingNo}`);
    } catch (err) {
      console.error("정모 등록 오류", err);
      alert("정모 등록 중 오류가 발생했습니다.");
    }
  }, [meeting, attach, crewNo, navigate]);

  return (
    <>
      {/* 헤더 */}
      <Header input={false} />
      <div
        className="d-flex flex-column align-items-center"
        style={{ paddingTop: "70px", paddingBottom: "80px" }}
      >
        <div style={{ marginBottom: "48px", marginTop: "80px" }}>
          <span
            style={{ fontSize: "24px", fontWeight: "bold", color: "#111111" }}
          >
            정모 추가
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
            onClick={() => setIsPostcodeOpen(true)}
          >
            {meeting.meetingLocation || "정모 위치를 검색해주세요!"}
          </div>
          <button
            className="light-gray-btn mt-2"
            style={{ backgroundColor: "#6C757D", color: "#ffffff" }}
            onClick={() => setIsPostcodeOpen(true)}
          >
            장소 검색하기
          </button>

          {isPostcodeOpen && (
            <PostcodeModal
              onClose={() => setIsPostcodeOpen(false)}
              onComplete={openPostModal}
            />
          )}
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">정모 비용</label>
          <input
            type="text"
            inputMode="numeric"
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
          >
            {meetingLimitList.map((count) => (
              <option key={count} value={count}>
                {count}명
              </option>
            ))}
          </select>
        </div>
        <div style={{ width: "360px", margin: "0 auto" }}>
          <button
            className={isTotalValid ? "blue-btn" : "light-gray-btn"}
            onClick={meetingAdd}
            disabled={!isTotalValid}
          >
            정모 추가하기
          </button>
        </div>
      </div>
    </>
  );
}
