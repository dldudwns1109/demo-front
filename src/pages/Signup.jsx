import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { toast, ToastContainer } from "react-toastify";
import Header from "../components/Header";
import { locationState } from "../utils/storage";

import { MdEdit } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";

import locationData from "../json/location.json";
import schoolData from "../json/school.json";
import categoryData from "../json/category.json";
import mbtiData from "../json/mbti.json";

const locationOptions = locationData;
const schoolOptions = schoolData;
const categoryOptions = categoryData.slice(1);
const mbtiOptions = mbtiData;

export default function Signup() {
  const [location, setLocation] = useRecoilState(locationState);
  const [profileImg, setProfileImg] = useState(null);
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
    memberNickname: "",
    memberEmail: "",
    memberLocation: "",
    memberSchool: "가천대학교",
    memberGender: "m",
    memberBirth: "",
    memberMbti: "ISTJ",
  });
  const [memberLike, setMemberLike] = useState(new Set([]));
  const [isOpenLocationRef, setIsOpenLocationRef] = useState(false);
  const [isOpenSchoolRef, setIsOpenSchoolRef] = useState(false);

  const areaList = useMemo(() => {
    if (location !== null) {
      let list = null;
      locationData.forEach((v) => {
        list = v.city === location.city ? v.area : list;
      });
      return list;
    }
  }, [location]);

  const locationRef = useRef(null);
  const schoolRef = useRef(null);

  const errorToastify = (message) => toast.error(message);

  useEffect(() => {
    setMember({
      ...member,
      memberLocation: `${location.city} ${location.area}`,
    });
  }, [location]);

  useEffect(() => {
    console.log(member.memberLocation);
  }, [member]);

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

  return (
    <div className="vh-100">
      <Header input={false} />
      <div
        className="d-flex justify-content-center h-100"
        style={{
          paddingTop: "70px",
          paddingLeft: "8.33%",
          paddingRight: "8.33%",
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
            회원가입
          </span>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "48px" }}
          >
            <label htmlFor="file" className="position-relative">
              <img
                src={profileImg ?? "images/default-profile.svg"}
                className="shadow-sm"
                width={200}
                height={200}
                style={{ borderRadius: "999px", objectFit: "cover" }}
              />
              <div
                className="position-absolute bg-white d-flex align-items-center"
                style={{
                  padding: "8px",
                  height: "36px",
                  bottom: "8px",
                  right: "8px",
                  borderRadius: "999px",
                  border: "1px solid #EBEBEB",
                }}
              >
                <MdEdit size={18} />
              </div>
            </label>
            <input
              type="file"
              id="file"
              accept="image/*"
              className="d-none"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith("image/")) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setProfileImg(reader.result);
                  };
                  reader.readAsDataURL(file);
                } else {
                  errorToastify("이미지 파일을 선택해주세요.");
                }
              }}
            />
          </div>
          <div>
            <div className="d-flex flex-column gap-2 mt-3">
              <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
                아이디
              </label>
              <input
                type="text"
                className="border-0 py-2"
                style={{
                  backgroundColor: "#F1F3F5",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  borderRadius: "8px",
                  outline: 0,
                }}
                placeholder="4~14자 / 영문,숫자 사용 가능"
                // ref={emailInputRef}
                // value={memberEmail}
                // onChange={(e) => setMemberEmail(e.target.value)}
                // onBlur={() => {
                //   if (!memberEmail.length) {
                //     setBlurMessage("이메일 주소를 입력해주세요.");
                //     return;
                //   }

                //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
                //     setBlurMessage("올바른 이메일 주소를 입력해주세요.");
                //     return;
                //   }

                //   setBlurMessage("");
                // }}
              />
            </div>
            {/* <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage}
              </span>
            </div> */}
          </div>
          <div>
            <div className="d-flex flex-column gap-2 mt-3">
              <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
                닉네임
              </label>
              <input
                type="text"
                className="border-0 py-2"
                style={{
                  backgroundColor: "#F1F3F5",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  borderRadius: "8px",
                  outline: 0,
                }}
                placeholder="2~10자 / 한글,숫자 사용 가능"
                // ref={emailInputRef}
                // value={memberEmail}
                // onChange={(e) => setMemberEmail(e.target.value)}
                // onBlur={() => {
                //   if (!memberEmail.length) {
                //     setBlurMessage("이메일 주소를 입력해주세요.");
                //     return;
                //   }

                //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
                //     setBlurMessage("올바른 이메일 주소를 입력해주세요.");
                //     return;
                //   }

                //   setBlurMessage("");
                // }}
              />
            </div>
            {/* <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage}
              </span>
            </div> */}
          </div>
          <div>
            <div className="d-flex flex-column gap-2 mt-3">
              <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
                비밀번호
              </label>
              <input
                type="password"
                className="border-0 py-2"
                style={{
                  backgroundColor: "#F1F3F5",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  borderRadius: "8px",
                  outline: 0,
                }}
                placeholder="8~16자 / 영어,특수문자 조합"
                // ref={emailInputRef}
                // value={memberEmail}
                // onChange={(e) => setMemberEmail(e.target.value)}
                // onBlur={() => {
                //   if (!memberEmail.length) {
                //     setBlurMessage("이메일 주소를 입력해주세요.");
                //     return;
                //   }

                //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
                //     setBlurMessage("올바른 이메일 주소를 입력해주세요.");
                //     return;
                //   }

                //   setBlurMessage("");
                // }}
              />
            </div>
            {/* <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage}
              </span>
            </div> */}
          </div>
          <div>
            <div className="d-flex flex-column gap-2 mt-3">
              <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
                비밀번호 확인
              </label>
              <input
                type="password"
                className="border-0 py-2"
                style={{
                  backgroundColor: "#F1F3F5",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  borderRadius: "8px",
                  outline: 0,
                }}
                // ref={emailInputRef}
                // value={memberEmail}
                // onChange={(e) => setMemberEmail(e.target.value)}
                // onBlur={() => {
                //   if (!memberEmail.length) {
                //     setBlurMessage("이메일 주소를 입력해주세요.");
                //     return;
                //   }

                //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
                //     setBlurMessage("올바른 이메일 주소를 입력해주세요.");
                //     return;
                //   }

                //   setBlurMessage("");
                // }}
              />
            </div>
            {/* <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage}
              </span>
            </div> */}
          </div>
          <div>
            <div className="d-flex flex-column gap-2 mt-3">
              <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
                이메일
              </label>
              <input
                type="email"
                className="border-0 py-2"
                style={{
                  backgroundColor: "#F1F3F5",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  borderRadius: "8px",
                  outline: 0,
                }}
                placeholder="이메일을 입력해주세요."
                // ref={emailInputRef}
                // value={memberEmail}
                // onChange={(e) => setMemberEmail(e.target.value)}
                // onBlur={() => {
                //   if (!memberEmail.length) {
                //     setBlurMessage("이메일 주소를 입력해주세요.");
                //     return;
                //   }

                //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
                //     setBlurMessage("올바른 이메일 주소를 입력해주세요.");
                //     return;
                //   }

                //   setBlurMessage("");
                // }}
              />
            </div>
            {/* <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage}
              </span>
            </div> */}
          </div>
          <div>
            <div className="d-flex flex-column gap-2 mt-3">
              <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
                생년월일
              </label>
              <input
                type="datetime-local"
                className="border-0 py-2"
                style={{
                  backgroundColor: "#F1F3F5",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  borderRadius: "8px",
                  outline: 0,
                }}
                placeholder="2000-01-01"
                // ref={emailInputRef}
                // value={memberEmail}
                // onChange={(e) => setMemberEmail(e.target.value)}
                // onBlur={() => {
                //   if (!memberEmail.length) {
                //     setBlurMessage("이메일 주소를 입력해주세요.");
                //     return;
                //   }

                //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
                //     setBlurMessage("올바른 이메일 주소를 입력해주세요.");
                //     return;
                //   }

                //   setBlurMessage("");
                // }}
              />
            </div>
            {/* <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage}
              </span>
            </div> */}
          </div>
          <div>
            <div className="d-flex flex-column gap-2 mt-3">
              <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
                성별
              </label>
              <div className="d-flex gap-3">
                <div className="d-flex gap-2">
                  <input
                    type="radio"
                    id="male"
                    value="m"
                    checked={member.memberGender === "m"}
                    onChange={(e) =>
                      setMember({
                        ...member,
                        memberGender: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="male">남자</label>
                </div>
                <div className="d-flex gap-2">
                  <input
                    type="radio"
                    id="female"
                    value="f"
                    checked={member.memberGender === "f"}
                    onChange={(e) =>
                      setMember({
                        ...member,
                        memberGender: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="female">여자</label>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column gap-2 mt-3">
            <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
              거주지
            </label>
            <div>
              <button
                className="w-100 bg-white border border-1 ps-3 py-2 d-flex justify-content-between align-items-center"
                style={{
                  borderRadius: "8px",
                  color: "#111111",
                  borderColor: "#EBEBEB",
                }}
                onClick={() => {
                  setIsOpenLocationRef(true);
                }}
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
                            location.city === v.city
                              ? "bg-primary text-white"
                              : "bg-white"
                          } ps-2 pe-4 py-2`}
                          style={{
                            fontSize: "14px",
                            borderRadius: "8px",
                          }}
                          onClick={() => {
                            setLocation({
                              ...location,
                              city: v.city,
                            });
                          }}
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
                              ...location,
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
          </div>

          <div className="d-flex flex-column gap-2 mt-3">
            <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
              재학중인 학교
            </label>
            <div>
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
                    color: `${memberLike.has(v) ? "#FFFFFF" : "#333333"}`,
                    backgroundColor: `${
                      memberLike.has(v) ? "#F9B4ED" : "#FFFFFF"
                    }`,
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    setMemberLike((memberLike) => {
                      const newSet = new Set(memberLike);
                      newSet.has(v) ? newSet.delete(v) : newSet.add(v);
                      return newSet;
                    });
                  }}
                >
                  {v}
                </button>
              ))}
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

          <button
            className="btn btn-primary text-white"
            style={{ marginTop: "48px" }}
            onClick={async () => {
              if (!memberEmail.length) {
                errorToastify("이메일 주소를 입력해주세요.");
                return;
              }

              const res = await axios.get(
                `http://localhost:8080/api/member/memberEmail/${memberEmail}`
              );

              if (res.data === "") {
                errorToastify("존재하지 않는 아이디입니다.");
              }

              setFindId(res.data);
            }}
            // disabled={!isValid}
          >
            회원가입
          </button>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        pauseOnHover={false}
        theme="light"
        limit={1}
      />
    </div>
  );
}
