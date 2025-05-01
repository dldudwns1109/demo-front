import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import axios from "axios";
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
  const [city, setCity] = useState("서울특별시");
  const [member, setMember] = useState({
    memberImg: null,
    memberId: "",
    memberNickname: "",
    memberPw: "",
    memberEmail: "",
    memberBirth: "",
    memberGender: "m",
    memberLocation: "",
    memberSchool: schoolData[0],
    memberLike: new Set([]),
    memberMbti: mbtiData[0],
  });
  const [memberPwConfirm, setMemberPwConfirm] = useState("");
  const [isOpenLocationRef, setIsOpenLocationRef] = useState(false);
  const [isOpenSchoolRef, setIsOpenSchoolRef] = useState(false);
  const [blurMessage, setBlurMessage] = useState({
    memberId: "",
    memberNickname: "",
    memberPw: "",
    memberPwConfirm: "",
    memberEmail: "",
    memberBirth: "",
    memberLike: "",
  });
  const [isValid, setIsValid] = useState({
    memberId: false,
    memberNickname: false,
    memberPw: false,
    memberPwConfirm: false,
    memberEmail: false,
    memberBirth: false,
    memberLike: false,
  });

  const areaList = useMemo(() => {
    if (city !== null) {
      let list = null;
      locationData.forEach((v) => {
        list = v.city === city ? v.area : list;
      });
      return list;
    }
  }, [city]);

  const isTotalValid = useMemo(() => {
    return Object.values(isValid).every((val) => val);
  }, [isValid]);

  const isFirstRender = useRef(true);
  const locationRef = useRef(null);
  const schoolRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    setMember({
      ...member,
      memberLocation: `${location.city} ${location.area}`,
    });
  }, [location, city]);

  useEffect(() => {
    if (member.memberPw !== "" && memberPwConfirm === "") {
      setBlurMessage({
        ...blurMessage,
        memberPwConfirm: "비밀번호 확인을 입력해주세요.",
      });
      setIsValid({
        ...isValid,
        memberPwConfirm: false,
      });
      return;
    }

    if (member.memberPw !== memberPwConfirm) {
      setBlurMessage({
        ...blurMessage,
        memberPwConfirm: "입력한 비밀번호와 다릅니다.",
      });
      setIsValid({
        ...isValid,
        memberPwConfirm: false,
      });
      return;
    }

    setBlurMessage({
      ...blurMessage,
      memberPwConfirm: "",
    });
    setIsValid({
      ...isValid,
      memberPwConfirm: true,
    });
  }, [member.memberPw, memberPwConfirm]);

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
      setIsValid({
        ...isValid,
        memberLike: false,
      });
      return;
    }

    setBlurMessage({
      ...blurMessage,
      memberLike: "",
    });
    setIsValid({
      ...isValid,
      memberLike: true,
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

  return (
    <div>
      <Header input={false} />
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
            회원가입
          </span>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "48px" }}
          >
            <label htmlFor="file" className="position-relative">
              <img
                src={member.memberImg ?? "images/default-profile.svg"}
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
                  reader.onload = () =>
                    setMember({ ...member, memberImg: reader.result });
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
                placeholder="5~14자 / 영문,숫자 사용 가능"
                value={member.memberId}
                onChange={(e) => {
                  setMember({
                    ...member,
                    memberId: e.target.value,
                  });
                }}
                onBlur={async () => {
                  if (!member.memberId.length) {
                    setBlurMessage({
                      ...blurMessage,
                      memberId: "아이디를 입력해주세요.",
                    });
                    setIsValid({
                      ...isValid,
                      memberId: false,
                    });
                    return;
                  }

                  if (!/^[a-z][a-z0-9]{4,14}$/.test(member.memberId)) {
                    setBlurMessage({
                      ...blurMessage,
                      memberId: "5~14자 / 영문,숫자로만 입력 가능합니다.",
                    });
                    setIsValid({
                      ...isValid,
                      memberId: false,
                    });
                    return;
                  }

                  const res = await axios.get(
                    `http://localhost:8080/api/member/checkDuplicatedId/${member.memberId}`
                  );
                  if (res.data) {
                    setBlurMessage({
                      ...blurMessage,
                      memberId: "사용중인 아이디입니다.",
                    });
                    setIsValid({
                      ...isValid,
                      memberId: false,
                    });
                    return;
                  }

                  setBlurMessage({
                    ...blurMessage,
                    memberId: "",
                  });
                  setIsValid({
                    ...isValid,
                    memberId: true,
                  });
                }}
              />
            </div>
            <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage.memberId}
              </span>
            </div>
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
                value={member.memberNickname}
                onChange={(e) =>
                  setMember({
                    ...member,
                    memberNickname: e.target.value,
                  })
                }
                onBlur={async () => {
                  if (!member.memberNickname.length) {
                    setBlurMessage({
                      ...blurMessage,
                      memberNickname: "닉네임을 입력해주세요.",
                    });
                    setIsValid({
                      ...isValid,
                      memberNickname: false,
                    });
                    return;
                  }

                  if (!/^[가-힣0-9]{2,10}$/.test(member.memberNickname)) {
                    setBlurMessage({
                      ...blurMessage,
                      memberNickname: "2~10자 / 한글,숫자로만 입력 가능합니다.",
                    });
                    setIsValid({
                      ...isValid,
                      memberNickname: false,
                    });
                    return;
                  }

                  const res = await axios.get(
                    `http://localhost:8080/api/member/checkDuplicatedNickname/${member.memberNickname}`
                  );
                  if (res.data) {
                    setBlurMessage({
                      ...blurMessage,
                      memberNickname: "사용중인 닉네임입니다.",
                    });
                    setIsValid({
                      ...isValid,
                      memberNickname: false,
                    });
                    return;
                  }

                  setBlurMessage({
                    ...blurMessage,
                    memberNickname: "",
                  });
                  setIsValid({
                    ...isValid,
                    memberNickname: true,
                  });
                }}
              />
            </div>
            <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage.memberNickname}
              </span>
            </div>
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
                placeholder="비밀번호를 입력해주세요."
                value={member.memberPw}
                onChange={(e) =>
                  setMember({
                    ...member,
                    memberPw: e.target.value,
                  })
                }
                onBlur={() => {
                  if (!member.memberPw.length) {
                    setBlurMessage({
                      ...blurMessage,
                      memberPw: "비밀번호를 입력해주세요.",
                    });
                    setIsValid({
                      ...isValid,
                      memberPw: false,
                    });
                    return;
                  }

                  if (member.memberPw.length > 85) {
                    setBlurMessage({
                      ...blurMessage,
                      memberPw: "비밀번호가 길어 제한됩니다.",
                    });
                    setIsValid({
                      ...isValid,
                      memberPw: false,
                    });
                    return;
                  }

                  setBlurMessage({
                    ...blurMessage,
                    memberPw: "",
                  });
                  setIsValid({
                    ...isValid,
                    memberPw: true,
                  });
                }}
              />
            </div>
            <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage.memberPw}
              </span>
            </div>
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
                value={memberPwConfirm}
                onChange={(e) => setMemberPwConfirm(e.target.value)}
              />
            </div>
            <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage.memberPwConfirm}
              </span>
            </div>
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
                value={member.memberEmail}
                onChange={(e) =>
                  setMember({
                    ...member,
                    memberEmail: e.target.value,
                  })
                }
                onBlur={async () => {
                  if (!member.memberEmail.length) {
                    setBlurMessage({
                      ...blurMessage,
                      memberEmail: "이메일 주소를 입력해주세요.",
                    });
                    setIsValid({
                      ...isValid,
                      memberEmail: false,
                    });
                    return;
                  }

                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.memberEmail)) {
                    setBlurMessage({
                      ...blurMessage,
                      memberEmail: "올바른 이메일 주소를 입력해주세요.",
                    });
                    setIsValid({
                      ...isValid,
                      memberEmail: false,
                    });
                    return;
                  }

                  const res = await axios.get(
                    `http://localhost:8080/api/member/checkDuplicatedEmail/${member.memberEmail}`
                  );
                  if (res.data) {
                    setBlurMessage({
                      ...blurMessage,
                      memberEmail: "사용중인 이메일입니다.",
                    });
                    setIsValid({
                      ...isValid,
                      memberEmail: false,
                    });
                    return;
                  }

                  setBlurMessage({
                    ...blurMessage,
                    memberEmail: "",
                  });
                  setIsValid({
                    ...isValid,
                    memberEmail: true,
                  });
                }}
              />
            </div>
            <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage.memberEmail}
              </span>
            </div>
          </div>
          <div>
            <div className="d-flex flex-column gap-2 mt-3">
              <label className="fs-6 fw-bold" style={{ color: "#111111" }}>
                생년월일
              </label>
              <input
                type="date"
                className="border-0 py-2"
                style={{
                  backgroundColor: "#F1F3F5",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  borderRadius: "8px",
                  outline: 0,
                }}
                placeholder="2000-01-01"
                value={member.memberBirth}
                onChange={(e) =>
                  setMember({
                    ...member,
                    memberBirth: e.target.value,
                  })
                }
                onBlur={() => {
                  if (!member.memberBirth.length) {
                    setBlurMessage({
                      ...blurMessage,
                      memberBirth: "생년월일을 입력해주세요.",
                    });
                    setIsValid({
                      ...isValid,
                      memberBirth: false,
                    });
                    return;
                  }

                  setBlurMessage({
                    ...blurMessage,
                    memberBirth: "",
                  });
                  setIsValid({
                    ...isValid,
                    memberBirth: true,
                  });
                }}
              />
            </div>
            <div>
              <span className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage.memberBirth}
              </span>
            </div>
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
                            city === v.city
                              ? "bg-primary text-white"
                              : "bg-white"
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

          <button
            className="btn btn-primary text-white"
            style={{ marginTop: "48px" }}
            onClick={async () => {
              try {
                await axios.post("http://localhost:8080/api/member/signup", {
                  ...member,
                  memberLike: Array.from(member.memberLike),
                });

                navigate("/signup-finish", {
                  state: { userNickname: member.memberNickname },
                });
              } catch (e) {
                console.error("");
              }
            }}
            disabled={!isTotalValid}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
