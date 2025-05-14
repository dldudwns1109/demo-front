import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PostcodeModal from "../components/PostcodeModal";
import axios from "axios";
import { loginState, userNoState } from "../utils/storage";
import { useRecoilValue } from "recoil";
import Unauthorized from "../components/Unauthorized";

const meetingLimitList = [3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15];

export default function MeetingEdit() {
  const { meetingNo } = useParams();
  const login = useRecoilValue(loginState);
  const navigate = useNavigate();
  const userNo = useRecoilValue(userNoState);
  const [isLeader, setIsLeader] = useState(null);

  const [meeting, setMeeting] = useState({
    meetingName: "",
    meetingDate: "",
    meetingLocation: "",
    meetingPrice: "",
    meetingLimit: 3,
  });
  const [attach, setAttach] = useState(undefined);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const fileInputRef = useRef();

  const [errors, setErrors] = useState({
    meetingName: "",
    meetingDate: "",
  });

  const isTotalValid = useMemo(() => {
    return (
      !!meeting.meetingName &&
      !!meeting.meetingDate &&
      !!meeting.meetingLocation &&
      !!meeting.meetingPrice &&
      !!meeting.meetingLimit &&
      !Object.values(errors).some((msg) => !!msg) // 에러 메시지 하나라도 있으면 false
    );
  }, [meeting, errors]);

  const changeMeeting = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "meetingPrice") {
      const numeric = value.replace(/[^0-9]/g, "");
      const withComma = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setMeeting((prev) => ({ ...prev, [name]: withComma }));
    } else {
      setMeeting((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const changeImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setAttach(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const openPostModal = useCallback((address) => {
    setMeeting((prev) => ({ ...prev, meetingLocation: address }));
  }, []);

  const loadMeetingData = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/meeting/${meetingNo}`
      );
      const data = res.data;

      setMeeting({
        meetingName: data.meetingName,
        meetingDate: data.meetingDate.replace(" ", "T").slice(0, 16),
        meetingLocation: data.meetingLocation,
        meetingPrice: data.meetingPrice.toLocaleString(),
        meetingLimit: data.meetingLimit,
      });
      setPreviewUrl(`http://localhost:8080/api/meeting/image/${meetingNo}`);

      // ✅ 모임장 여부 판단
      setIsLeader(data.meetingOwnerNo === userNo);
    } catch (err) {
      console.error("정모 정보 로딩 실패", err);
      setIsLeader(false); // 오류 시 접근 차단
    }
  }, [meetingNo, userNo]);

  useEffect(() => {
    loadMeetingData();
  }, []);

  const checkError = useCallback(() => {
    const value = meeting.meetingDate;
    let message = "";

    if (!value) {
      message = "정모 날짜를 입력해주세요.";
    } else if (new Date(value) < new Date()) {
      message = "정모 날짜는 현재 이후여야 해요.";
    }

    setErrors((prev) => ({ ...prev, meetingDate: message }));
    return !message; // 에러 없으면 true, 있으면 false
  }, [meeting]);

  const meetingEdit = useCallback(async () => {
    const isValid = checkError();
    if (!isValid) {
      alert("입력한 정보를 다시 확인해주세요.");
      return;
    }

    const formData = new FormData();
    Object.entries(meeting).forEach(([key, value]) => {
      let cleanValue = value;
      if (key === "meetingPrice") cleanValue = value.replaceAll(",", "");
      if (key === "meetingDate") cleanValue = value.replace("T", " ") + ":00";
      formData.append(key, cleanValue);
    });
    if (attach) formData.append("attach", attach);

    try {
      await axios.put(
        `http://localhost:8080/api/meeting/${meetingNo}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("정모가 수정되었습니다!");
      navigate(`/meeting/detail/${meetingNo}`);
    } catch (err) {
      console.error("정모 수정 오류", err);
      alert("정모 수정 중 오류가 발생했습니다.");
    }
  }, [meeting, attach, meetingNo, navigate, checkError]);

  // meetingNo 없거나, 모임장이 아닌 경우
  if (!meetingNo || isLeader === false) {
    return (
      <div className="vh-100">
        <Header input={false} loginState={`${login ? "loggined" : "login"}`} />
        <Unauthorized />
      </div>
    );
  }

  return (
    <>
      <Header loginState={login ? "loggined" : "login"} input={false} />
      <div
        className="d-flex flex-column align-items-center"
        style={{ paddingTop: "70px", paddingBottom: "80px" }}
      >
        <div style={{ marginBottom: "48px", marginTop: "80px" }}>
          <span
            style={{ fontSize: "24px", fontWeight: "bold", color: "#111111" }}
          >
            정모 수정
          </span>
        </div>
        <div>
          <img
            src={previewUrl || "/images/default-profile.svg"}
            onClick={changeImage}
            className="memberProfile"
            style={{ cursor: "pointer" }}
          />
        </div>
        <input
          type="file"
          accept=".png, .jpg"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">정모명</label>
          <input
            className="member-input"
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
            name="meetingDate"
            value={meeting.meetingDate}
            onChange={changeMeeting}
            onBlur={(e) => checkError(e.target.name, e.target.value)}
          />
          {errors.meetingDate && (
            <div style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.meetingDate}
            </div>
          )}
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
            onClick={meetingEdit}
            disabled={!isTotalValid}
          >
            정모 수정하기
          </button>
        </div>
      </div>
    </>
  );
}
