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
    if (member.memberPw !== "" && memberPwConfirm === "") {
      setBlurMessage({
        ...blurMessage,
        memberPwConfirm: "비밀번호 확인을 입력해주세요.",
      });
      return;
    }

    if (member.memberPw !== memberPwConfirm) {
      setBlurMessage({
        ...blurMessage,
        memberPwConfirm: "입력한 비밀번호와 다릅니다.",
      });
      return;
    }

    setBlurMessage({
      ...blurMessage,
      memberPwConfirm: "",
    });
  }, [member.memberPw, memberPwConfirm]);

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
                placeholder="4~14자 / 영문,숫자 사용 가능"
                value={member.memberId}
                onChange={(e) =>
                  setMember({
                    ...member,
                    memberId: e.target.value,
                  })
                }
                onBlur={() => {
                  if (!member.memberId.length) {
                    setBlurMessage({
                      ...blurMessage,
                      memberId: "아이디를 입력해주세요.",
                    });
                    return;
                  }

                  if (!/^[a-z][a-z0-9]{4,14}$/.test(member.memberId)) {
                    setBlurMessage({
                      ...blurMessage,
                      memberId: "4~14자 / 영문,숫자로만 입력 가능합니다.",
                    });
                    return;
                  }

                  setBlurMessage({
                    ...blurMessage,
                    memberId: "",
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
                onBlur={() => {
                  if (!member.memberNickname.length) {
                    setBlurMessage({
                      ...blurMessage,
                      memberNickname: "닉네임을 입력해주세요.",
                    });
                    return;
                  }

                  if (!/^[가-힣0-9]{2,10}$/.test(member.memberNickname)) {
                    setBlurMessage({
                      ...blurMessage,
                      memberNickname: "2~10자 / 한글,숫자로만 입력 가능합니다.",
                    });
                    return;
                  }

                  setBlurMessage({
                    ...blurMessage,
                    memberNickname: "",
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
                    return;
                  }

                  if (member.memberPw.length > 85) {
                    setBlurMessage({
                      ...blurMessage,
                      memberPw: "비밀번호가 길어 제한됩니다.",
                    });
                    return;
                  }

                  setBlurMessage({
                    ...blurMessage,
                    memberPw: "",
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
                onBlur={() => {
                  if (!member.memberEmail.length) {
                    setBlurMessage({
                      ...member,
                      memberEmail: "이메일 주소를 입력해주세요.",
                    });
                    return;
                  }

                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.memberEmail)) {
                    setBlurMessage({
                      ...member,
                      memberEmail: "올바른 이메일 주소를 입력해주세요.",
                    });
                    return;
                  }

                  setBlurMessage({
                    ...member,
                    memberEmail: "",
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
                    return;
                  }

                  setBlurMessage({
                    ...blurMessage,
                    memberBirth: "",
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
