import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import Header from "../components/Header";
import { locationState, userNoState } from "../utils/storage";

import locationData from "../json/location.json";
import schoolData from "../json/school.json";
import categoryData from "../json/category.json";
import mbtiData from "../json/mbti.json";
import { RiArrowDropDownLine } from "react-icons/ri";

const locationOptions = locationData;
const schoolOptions = schoolData;
const categoryOptions = categoryData.slice(1);
const mbtiOptions = mbtiData;

export default function MypageEdit() {
  const userNo = useRecoilValue(userNoState);
  console.log(userNo);
  const [location, setLocation] = useRecoilState(locationState);
  const navigate = useNavigate();

  const [city, setCity] = useState("서울특별시");
  const [previewImg, setPreviewImg] = useState(null);
  const [member, setMember] = useState({
    memberId: "",
    memberNickname: "",
    memberEmail: "",
    memberBirth: "",
    memberGender: "m",
    memberLocation: "",
    memberSchool: schoolData[0],
    memberLike: new Set([]),
    memberMbti: mbtiData[0],
  });
  const [attach, setAttach] = useState(null);
  const [blurMessage, setBlurMessage] = useState({
    memberId: "",
    memberNickname: "",
    memberPw: "",
    memberPwConfirm: "",
    memberEmail: "",
    memberBirth: "",
    memberLike: "",
  });

  const fileInputRef = useRef(null);
  const isFirstRender = useRef(true);
  const locationRef = useRef(null);
  const schoolRef = useRef(null);
  const [isOpenLocationRef, setIsOpenLocationRef] = useState(false);
  const [isOpenSchoolRef, setIsOpenSchoolRef] = useState(false);

  const areaList = useMemo(() => {
    if (city !== null) {
      let list = null;
      locationData.forEach((v) => {
        list = v.city === city ? v.area : list;
      });
      return list;
    }
  }, [city]);

  useEffect(() => {
    setMember((prev) => ({
      ...prev,
      memberLocation: `${location.city} ${location.area}`,
    }));
  }, [location, city]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!member.memberLike.size) {
      setBlurMessage({
        ...blurMessage,
        memberLike: "최소한 한 개의 관심사를 선택해주세요.",
      });
      return;
    }

    setBlurMessage({
      ...blurMessage,
      memberLike: "",
    });
  }, [member.memberLike]);

  useEffect(() => {
    const clickLocationRefOutside = (e) => {
      if (!locationRef.current?.contains(e.target)) {
        setIsOpenLocationRef(false);
      }
    };
    const clickSchoolRefOutside = (e) => {
      if (!schoolRef.current?.contains(e.target)) {
        setIsOpenSchoolRef(false);
      }
    };

    document.addEventListener("mousedown", clickLocationRefOutside);
    document.addEventListener("mousedown", clickSchoolRefOutside);

    return () => {
      document.removeEventListener("mousedown", clickLocationRefOutside);
      document.removeEventListener("mousedown", clickSchoolRefOutside);
    };
  }, [locationRef, schoolRef]);

  useEffect(() => {
    if (!userNo) return;

    axios.get(`http://localhost:8080/api/member/${userNo}`).then((res) => {
      const data = res.data;
      const [city, area] = data.memberLocation.split(" ");
      setCity(city);
      setLocation({ city, area });
      setPreviewImg(`http://localhost:8080/api/member/image/${data.memberNo}`);

      setMember({
        memberId: data.memberId,
        memberNickname: data.memberNickname,
        memberEmail: data.memberEmail,
        memberBirth: data.memberBirth,
        memberGender: data.memberGender,
        memberLocation: data.memberLocation,
        memberSchool: data.memberSchool,
        memberLike: new Set(data.memberLike),
        memberMbti: data.memberMbti,
      });
    });
  }, [userNo]);

  const changeMember = useCallback((e) => {
    const { name, value } = e.target;
    setMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const changeImage = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
        setPreviewImg(reader.result);
        setAttach(file);
      }
      reader.readAsDataURL(file);
    }
  };

  const clickEdit = async () => {
    const formData = new FormData();
    for (let key in member) {
      if (key === "memberLike") {
        formData.append(key, Array.from(member[key]).join(","));
      } else {
        formData.append(key, member[key]);
      }
    }
    if (attach) formData.append("attach", attach);

    try {
      await axios.patch(
        `http://localhost:8080/api/member/${userNo}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("개인정보가 수정되었습니다!");
      navigate("/mypage");
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("수정 중 오류가 발생했습니다");
    }
  };

  //view
  return (
    <>
      {/* 헤더 */}
      <Header input={false} />
      {/* 수정 페이지 */}
      <div
        className="d-flex justify-content-center h-100"
        style={{
          paddingTop: "70px",
          paddingLeft: "8.33%",
          paddingRight: "8.33%",
          paddingBottom: "80px",
        }}
      >
        <div
          className="d-flex flex-column"
          style={{ width: "360px", marginTop: "80px" }}
        >
          <span
            className="fs-4 fw-bold text-center"
            style={{ color: "#111111" }}
          >
            개인정보수정
          </span>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "48px" }}
          >
            <img
              src={previewImg ?? "/images/default-profile.svg"}
              onClick={changeImage}
              className="memberProfile"
              style={{ cursor: "pointer" }}
            />
          </div>
          <input
            type="file"
            className="form-control"
            name="memberProfile"
            accept=".png, .jpg"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div
            style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}
          >
            <label className="label-text">아이디</label>
            <input
              className="member-input"
              name="memberId"
              value={member.memberId}
              onChange={changeMember}
              disabled
            />
          </div>
          <div
            style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}
          >
            <label className="label-text">닉네임</label>
            <input
              className="member-input"
              name="memberNickname"
              value={member.memberNickname}
              onChange={changeMember}
            />
          </div>
          <div
            style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}
          >
            <label className="label-text">비밀번호</label>
            <button
              className="light-gray-btn"
              style={{ backgroundColor: "#6C757D", color: "#ffffff" }}
              onClick={() => navigate("/mypage/edit/password")}
            >
              비밀번호 변경하기
            </button>
          </div>
          <div
            style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}
          >
            <label className="label-text">이메일</label>
            <input
              type="text"
              className="member-input"
              name="memberEmail"
              value={member.memberEmail}
              onChange={changeMember}
            />
          </div>
          <div
            style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}
          >
            <label className="label-text">생년월일</label>
            <input
              type="text"
              className="member-input"
              name="memberBirth"
              value={member.memberBirth}
              onChange={changeMember}
              disabled
            />
          </div>
          <div
            style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}
          >
            <label className="label-text">성별</label>

            <div className="d-flex">
              <input
                type="radio"
                name="memberGender"
                value="m"
                checked={member.memberGender === "m"}
                onChange={changeMember}
                disabled
              />
              <label
                style={{
                  marginLeft: "8px",
                  marginBottom: "0",
                  marginRight: "10px",
                }}
              >
                남자
              </label>
              <input
                type="radio"
                name="memberGender"
                value="f"
                checked={member.memberGender === "f"}
                onChange={changeMember}
              />
              <label style={{ marginLeft: "8px" }}>여자</label>
            </div>
          </div>
          <div
            style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}
          >
            <label className="label-text">거주지</label>
            <button
              className="w-100 bg-white border border-1 ps-3 py-2 d-flex justify-content-between align-items-center"
              style={{
                borderRadius: "8px",
                color: "#111111",
                borderColor: "#EBEBEB",
              }}
              onClick={() => setIsOpenLocationRef(true)}
            >
              <div className="d-flex align-items-center gap-2">
                {location.area}
              </div>
              <RiArrowDropDownLine size={22} />
            </button>
            {isOpenLocationRef && (
              <div
                ref={locationRef}
                className="d-flex flex-column bg-white p-4 position-absolute shadow-lg"
                style={{ borderRadius: "8px" }}
              >
                <span className="mb-4">지역</span>
                <div className="d-flex">
                  <div
                    className="d-flex flex-column overflow-auto"
                    style={{ height: "300px" }}
                  >
                    {locationOptions.map((v, i) => (
                      <button
                        key={i}
                        className={`text-start border-0 ${
                          city === v.city ? "bg-primary text-white" : "bg-white"
                        } ps-2 pe-4 py-2`}
                        style={{
                          fontSize: "14px",
                          borderRadius: "8px",
                        }}
                        onClick={() => setCity(v.city)}
                      >
                        {v.city}
                      </button>
                    ))}
                  </div>
                  <div
                    className="d-flex flex-column overflow-auto"
                    style={{ width: "160px", height: "300px" }}
                  >
                    {areaList.map((v, i) => (
                      <button
                        key={i}
                        className={`text-start border-0 ${
                          location.area === v
                            ? "bg-primary text-white"
                            : "bg-white"
                        } ps-2 pe-4 py-2`}
                        style={{
                          fontSize: "14px",
                          borderRadius: "8px",
                        }}
                        onClick={() => {
                          setLocation({
                            city,
                            area: v,
                          });
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}
          >
            <label className="label-text">재학중인 학교</label>
            <button
              className="w-100 bg-white border border-1 ps-3 py-2 d-flex justify-content-between align-items-center"
              style={{
                borderRadius: "8px",
                color: "#111111",
                borderColor: "#EBEBEB",
              }}
              onClick={() => {
                setIsOpenSchoolRef(true);
              }}
            >
              <div className="d-flex align-items-center gap-2">
                {member.memberSchool}
              </div>
              <RiArrowDropDownLine size={22} />
            </button>
            {isOpenSchoolRef && (
              <div
                ref={schoolRef}
                className="d-flex flex-column bg-white p-4 position-absolute shadow-lg"
                style={{ borderRadius: "8px" }}
              >
                <div className="d-flex">
                  <div
                    className="d-flex flex-column overflow-auto"
                    style={{ height: "300px" }}
                  >
                    {schoolOptions.map((v, i) => (
                      <button
                        key={i}
                        className={`text-start border-0 ${
                          member.memberSchool === v
                            ? "bg-primary text-white"
                            : "bg-white"
                        } ps-2 pe-4 py-2`}
                        style={{
                          fontSize: "14px",
                          borderRadius: "8px",
                        }}
                        onClick={() => {
                          setMember({
                            ...member,
                            memberSchool: v,
                          });
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="d-flex flex-column gap-2 mt-3">
            <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
              관심사
            </label>
            <div className="d-flex gap-3 flex-wrap">
              {categoryOptions.map((v, i) => (
                <button
                  key={i}
                  className="btn"
                  style={{
                    borderColor: "#F9B4ED",
                    color: `${
                      member.memberLike.has(v) ? "#FFFFFF" : "#333333"
                    }`,
                    backgroundColor: `${
                      member.memberLike.has(v) ? "#F9B4ED" : "#FFFFFF"
                    }`,
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    setMember(() => {
                      const newSet = new Set(member.memberLike);
                      newSet.has(v) ? newSet.delete(v) : newSet.add(v);
                      return {
                        ...member,
                        memberLike: newSet,
                      };
                    });
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
            <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage.memberLike}
              </span>
            </div>
          </div>
          <div className="d-flex flex-column gap-2 mt-3">
            <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
              MBTI
            </label>
            <div className="d-flex gap-3 flex-wrap">
              {mbtiOptions.map((v, i) => (
                <button
                  key={i}
                  className="btn"
                  style={{
                    borderColor: "#F9B4ED",
                    color: `${member.memberMbti === v ? "#FFFFFF" : "#333333"}`,
                    backgroundColor: `${
                      member.memberMbti === v ? "#F9B4ED" : "#FFFFFF"
                    }`,
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    setMember({
                      ...member,
                      memberMbti: v,
                    });
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: "360px", margin: "0 auto" }}>
            <button
              className="blue-btn"
              style={{ marginTop: "48px" }}
              onClick={(e) => clickEdit(e)}
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
