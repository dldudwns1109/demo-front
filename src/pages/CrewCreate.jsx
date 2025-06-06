import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useRecoilState, useRecoilValue } from "recoil";
import { locationState, loginState } from "../utils/storage";
import locationData from "../json/location.json";
import categoryData from "../json/category.json";
import { RiArrowDropDownLine } from "react-icons/ri";
import changeIcon from "../utils/changeIcon";
import Unauthorized from "../components/Unauthorized";

const locationList = locationData;
const categoryList = categoryData.slice(1);
const crewLimitList = [20, 30, 40, 50];

const FIELD_LABELS = {
  crewName: "모임명",
  crewIntro: "모임 소개",
};

export default function CrewCreate() {
  const login = useRecoilValue(loginState);
  const [location, setLocation] = useRecoilState(locationState);
  const [city, setCity] = useState("서울특별시");
  const [isOpenLocationRef, setIsOpenLocationRef] = useState(false);
  const [crew, setCrew] = useState({
    crewName: "",
    crewCategory: "",
    crewLocation: "",
    crewLimit: 20,
    crewIntro: "",
  });
  const [attach, setAttach] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [totalPrice, setTotalPrice] = useState(4000);

  const [errorMessage, setErrorMessage] = useState({
    crewName: "",
    crewIntro: "",
    crewCategory: "",
    crewLocation: "",
  });
  const [isValid, setIsValid] = useState({
    crewName: false,
    crewIntro: false,
    crewCategory: false,
    crewLocation: false,
  });

  const fileInputRef = useRef();
  const locationRef = useRef(null);

  const areaList = useMemo(() => {
    const found = locationList.find((v) => v.city === city);
    return found ? found.area : [];
  }, [city]);

  const isTotalValid = useMemo(
    () => Object.values(isValid).every((v) => v),
    [isValid]
  );

  useEffect(() => {
    setTotalPrice(Math.ceil(crew.crewLimit / 5) * 1000);
  }, [crew.crewLimit]);

  useEffect(() => {
    const fullLocation = `${location.city} ${location.area}`;
    setCrew((prev) => ({
      ...prev,
      crewLocation: fullLocation,
    }));

    if (!location.area.trim()) {
      setErrorMessage((prev) => ({
        ...prev,
        crewLocation: "지역을 선택해주세요.",
      }));
      setIsValid((prev) => ({
        ...prev,
        crewLocation: false,
      }));
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        crewLocation: "",
      }));
      setIsValid((prev) => ({
        ...prev,
        crewLocation: true,
      }));
    }
  }, [location]);

  useEffect(() => {
    const clickOutside = (e) => {
      if (!locationRef.current?.contains(e.target)) setIsOpenLocationRef(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleBlur = useCallback((field, value) => {
    const label = FIELD_LABELS[field] || field;

    if (!value.trim()) {
      setErrorMessage((prev) => ({
        ...prev,
        [field]: `${label}을(를) 입력해주세요.`,
      }));
      setIsValid((prev) => ({
        ...prev,
        [field]: false,
      }));
      return;
    }

    if (field === "crewName") {
      const regex = /^.{4,20}$/;
      if (!regex.test(value)) {
        setErrorMessage((prev) => ({
          ...prev,
          crewName: "4~20자만 입력해주세요.",
        }));
        setIsValid((prev) => ({
          ...prev,
          crewName: false,
        }));
        return;
      }
    }

    if (field === "crewIntro") {
      if (value.length < 10) {
        setErrorMessage((prev) => ({
          ...prev,
          crewIntro: "소개는 최소 10자 이상 입력해주세요.",
        }));
        setIsValid((prev) => ({
          ...prev,
          crewIntro: false,
        }));
        return;
      }
    }

    setErrorMessage((prev) => ({
      ...prev,
      [field]: "",
    }));
    setIsValid((prev) => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  const changeCrew = useCallback((e) => {
    const { name, value } = e.target;
    setCrew((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const changeCrewCategory = useCallback((like) => {
    setCrew((prev) => ({
      ...prev,
      crewCategory: like,
    }));
    setErrorMessage((prev) => ({
      ...prev,
      crewCategory: "",
    }));
    setIsValid((prev) => ({
      ...prev,
      crewCategory: true,
    }));
  }, []);

  const changeCrewLimit = useCallback((e) => {
    const value = parseInt(e.target.value);
    setCrew((prev) => ({
      ...prev,
      crewLimit: value,
    }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setAttach(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setAttach(null);
      setPreviewUrl(null);
    }
  }, []);

  const openFileSelector = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const createCrew = useCallback(async () => {
    if (!attach) {
      alert("대표 이미지를 선택해주세요.");
      return;
    }
    const formData = new FormData();
    Object.entries(crew).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("totalAmount", totalPrice.toString());
    formData.append("attach", attach);

    try {
      const res = await axios.post("/pay/ready", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Refresh-Token": localStorage.getItem("refreshToken"),
          "Frontend-URL": "http://localhost:5173",
        },
      });

      const redirectUrl = res.data?.next_redirect_pc_url;
      if (redirectUrl) window.location.href = redirectUrl;
      else alert("결제 페이지로 이동할 수 없습니다.");
    } catch (error) {
      console.error("결제 실패", error);
      alert("모임 생성 중 문제가 발생했습니다.");
    }
  }, [crew, totalPrice, attach]);

  // 공통 래퍼 스타일
  const boxStyle = {
    width: "100%",
    maxWidth: "380px",
    padding: "0 16px",
    margin: "0 auto 24px",
  };

  //view
  return (
    <>
      <Header input={false} loginState={login ? "loggined" : "login"} />
      <div
        className="d-flex flex-column align-items-center"
        style={{ paddingTop: 70, paddingBottom: 80 }}
      >
        {login ? (
          <>
            <h2
              style={{
                margin: "60px 0 24px",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#111",
              }}
            >
              모임 개설
            </h2>

            <img
              src={previewUrl || "images/default-profile.svg"}
              onClick={openFileSelector}
              style={{
                cursor: "pointer",
                width: 200,
                height: 200,
                borderRadius: "50%",
                display: "block",
                margin: "0 auto 24px",
              }}
            />

            <input
              type="file"
              ref={fileInputRef}
              accept=".png, .jpg"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <div style={boxStyle}>
              <label className="label-text">모임명</label>
              <input
                className="member-input"
                style={{ outline: 0 }}
                placeholder="모임 이름을 작성해주세요!"
                name="crewName"
                value={crew.crewName}
                onChange={changeCrew}
                onBlur={() => handleBlur("crewName", crew.crewName)}
              />
              <small className="text-danger">{errorMessage.crewName}</small>
            </div>

            <div style={boxStyle}>
              <label className="label-text">모임 소개</label>
              <textarea
                style={{ width: "100%", height: 155, outline: 0 }}
                placeholder="모임을 소개하는 글을 작성해주세요!"
                name="crewIntro"
                value={crew.crewIntro}
                onChange={changeCrew}
                onBlur={() => handleBlur("crewIntro", crew.crewIntro)}
              />
              <small className="text-danger">{errorMessage.crewIntro}</small>
            </div>

            <div style={boxStyle}>
              <label className="label-text">활동 지역</label>
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
                        {locationList.map((v, i) => (
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
                              setIsOpenLocationRef(false);
                            }}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <small className="text-danger">
                  {errorMessage.crewLocation}
                </small>
              </div>
            </div>

            {/* 관심사, 인원 수 필드도 같은 boxStyle 사용 */}
            <div style={boxStyle}>
              <label className="label-text">관심사</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "24px",
                }}
              >
                {categoryList.map((like) => (
                  <button
                    key={like}
                    type="button"
                    className={`d-flex justify-content-center gap-2 mbti-badge ${
                      crew.crewCategory === like ? "active" : ""
                    }`}
                    onClick={() => changeCrewCategory(like)}
                  >
                    {changeIcon(
                      like,
                      crew.crewCategory === like ? "#FFFFFF" : "#666666"
                    )}
                    {like}
                  </button>
                ))}
              </div>
              <small className="text-danger">{errorMessage.crewCategory}</small>
            </div>

            <div style={boxStyle}>
              <label className="label-text">인원 수</label>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6C757D",
                  marginBottom: "8px",
                }}
              >
                * 인원 수에 따라 결제 금액이 상이할 수 있습니다
              </p>
              <select
                className="form-control"
                name="crewLimit"
                value={crew.crewLimit}
                onChange={changeCrewLimit}
              >
                {crewLimitList.map((count) => (
                  <option key={count} value={count}>
                    {count}명
                  </option>
                ))}
              </select>
              <p>
                최종 금액{" "}
                <span style={{ color: "#dc3545", fontWeight: "bold" }}>
                  [{totalPrice.toLocaleString()}]
                </span>
                원
              </p>
            </div>

            <div style={boxStyle}>
              <button
                className="btn w-100 btn-primary"
                disabled={!isTotalValid}
                onClick={createCrew}
              >
                모임개설하기
              </button>
            </div>
          </>
        ) : (
          <Unauthorized />
        )}
      </div>
    </>
  );
}
