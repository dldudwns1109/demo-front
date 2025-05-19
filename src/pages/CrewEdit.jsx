import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { loginState, userNoState } from "../utils/storage";
import { useRecoilValue } from "recoil";
import { RiArrowDropDownLine } from "react-icons/ri";
import locationData from "../json/location.json";

const locationList = locationData;

export default function CrewEdit() {
  const { crewNo } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const locationRef = useRef(null);

  const [crew, setCrew] = useState({
    crewName: "",
    crewCategory: "",
    crewLocation: "",
    crewIntro: "",
    crewImage: "",
  });

  const [location, setLocation] = useState({
    city: "서울특별시",
    area: "",
  });

  const [isOpenLocationRef, setIsOpenLocationRef] = useState(false);
  const [isOpenLocation, setIsOpenLocation] = useState(false);
  const [isLeader, setIsLeader] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [city, setCity] = useState("서울특별시");
  const [crewNameError, setCrewNameError] = useState("");
  const [crewIntroError, setCrewIntroError] = useState("");

  // 로그인 및 사용자 정보
  const login = useRecoilValue(loginState);
  const userNo = useRecoilValue(userNoState);

  const areaList = locationList.find((loc) => loc.city === city)?.area || [];

  const categories = [
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

  const getAuthHeaders = () => {
    const token = localStorage.getItem("refreshToken");
    return { Authorization: `Bearer ${token.trim()}` };
  };

  const checkLeaderStatus = async () => {
    try {
      if (!login || !userNo) {
        alert("권한이 없습니다.");
        navigate(`/crew/${crewNo}/detail`);
        return;
      }

      const headers = getAuthHeaders();
      const res = await axios.get(
        `/crewmember/${crewNo}/leader`,
        { headers }
      );

      // 모임장 여부가 아니면 예외 처리
      if (!res.data) throw new Error("권한이 없습니다.");

      setIsLeader(true);
    } catch (err) {
      console.error("모임장 여부 확인 실패:", err.message);
      alert("권한이 없습니다.");
      navigate(`/crew/${crewNo}/detail`);
    }
  };

  useEffect(() => {
    checkLeaderStatus();
    fetchCrewData();
  }, [login, crewNo]);

  /* 모임 정보 불러오기 */
  const fetchCrewData = async () => {
    try {
      const res = await axios.get(`/crew/${crewNo}`);
      const crewData = res.data;

      const [city, area] = crewData.crewLocation.split(" ");

      setCrew({
        crewName: crewData.crewName,
        crewCategory: crewData.crewCategory,
        crewLocation: crewData.crewLocation,
        crewIntro: crewData.crewIntro,
        crewImage: `${import.meta.env.VITE_AJAX_BASE_URL}/crew/image/${crewNo}`,
      });

      setLocation({ city, area });
      setImagePreview(`${import.meta.env.VITE_AJAX_BASE_URL}/crew/image/${crewNo}`);
    } catch (err) {
      console.error("Error fetching crew data:", err.message);
      alert("모임 정보를 불러오는데 실패했습니다.");
      navigate(`/crew/${crewNo}/detail`);
    }
  };

  /* 페이지 진입 시 모임장 여부 확인 및 모임 정보 불러오기 */
  useEffect(() => {
    if (login) {
      checkLeaderStatus();
      fetchCrewData();
    }
  }, [login, crewNo]);

  /* 모임장 여부 체크 후 권한이 없을 경우 리다이렉트 */
  useEffect(() => {
    if (isLeader === false) {
      alert("모임장만 접근할 수 있습니다.");
      navigate(`/crew/${crewNo}/detail`);
    }
  }, [isLeader, crewNo, navigate]);

  useEffect(() => {
    const clickOutside = (e) => {
      if (!locationRef.current?.contains(e.target)) setIsOpenLocationRef(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /** 이미지 클릭 시 파일 선택 */
  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 모임이름 길이 체크
    if (name === "crewName") {
      if (value.length < 4 || value.length > 20) {
        setCrewNameError("모임이름은 4글자~ 20글자 사이로 작성하십시오.");
      } else {
        setCrewNameError("");
      }
    }

    if (name === "crewIntro") {
      if (value.length < 10) {
        setCrewIntroError("소개는 최소 10자 이상 입력해주세요.");
      } else {
        setCrewIntroError("");
      }
    }

    setCrew((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category) => {
    setCrew((prev) => ({ ...prev, crewCategory: category }));
  };

  const handleLocationSelect = (area) => {
    setLocation((prev) => ({ ...prev, area }));
    setCrew((prev) => ({
      ...prev,
      crewLocation: `${location.city} ${area}`,
    }));
    setIsOpenLocation(false);
  };

  const handleSubmit = async () => {
    if (!crew.crewName.trim() || !crew.crewIntro.trim()) {
      alert("모임명과 소개를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.put(
        `/crew/${crewNo}`,
        {
          crewNo: crewNo,
          crewName: crew.crewName,
          crewCategory: crew.crewCategory,
          // crewLocation: crew.crewLocation,
          crewLocation: `${location.city} ${location.area}`,
          crewIntro: crew.crewIntro,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
        }
      );

      if (response.data) {
        alert("모임이 수정되었습니다.");
        navigate(`/crew/${crewNo}/detail`);
      } else {
        alert("모임 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error updating crew:", err.message);
      alert("모임 수정에 실패했습니다.");
    }
  };
  const boxStyle = {
    width: "100%",
    maxWidth: "380px",
    padding: "0 16px",
    margin: "0 auto 24px",
  };

  return (
    <>
      <Header loginState={`${login ? "loggined" : "login"}`} input={false} />
      <div
        className="d-flex flex-column align-items-center"
        style={{ paddingTop: "70px", paddingBottom: "80px" }}
      >
        <h2
          style={{
            margin: "60px 0 24px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#111",
          }}
        >
          모임 수정
        </h2>

        <img
          src={imagePreview || "/images/default-profile.svg"}
          onClick={openFileSelector}
          className="memberProfile"
          style={{
            cursor: "pointer",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            margin: "0 auto 24px",
          }}
          alt="모임 이미지"
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* 모임명 입력 */}
        <div style={boxStyle}>
          <label className="label-text">모임명</label>
          <input
            className="member-input"
            name="crewName"
            value={crew.crewName}
            onChange={handleInputChange}
            style={{ borderColor: crewNameError ? "#dc3545" : "#ced4da" }}
          />
          {crewNameError && (
            <div className="text-danger" style={{ fontSize: "14px" }}>
              {crewNameError}
            </div>
          )}
        </div>

        {/* 모임 소개 */}
        <div style={boxStyle}>
          <label className="label-text">모임 소개</label>
          <textarea
            style={{
              height: "300px",
              borderColor: crewIntroError ? "#dc3545" : "#ced4da",
            }}
            className="member-input"
            rows="20"
            name="crewIntro"
            value={crew.crewIntro}
            onChange={handleInputChange}
          />
          {crewIntroError && (
            <div className="text-danger" style={{ fontSize: "14px" }}>
              {crewIntroError}
            </div>
          )}
        </div>

        <div style={boxStyle}>
          <label className="label-text">활동 지역</label>
          <button
            className="w-100 bg-white border border-1 ps-3 py-2 d-flex justify-content-between align-items-center"
            style={{
              borderRadius: "8px",
              color: "#111111",
              borderColor: "#EBEBEB",
            }}
            onClick={() => setIsOpenLocationRef(!isOpenLocationRef)}
          >
            <div className="d-flex align-items-center gap-2">
              {location.area || "지역을 선택하세요"}
            </div>
            <RiArrowDropDownLine size={22} />
          </button>

          {isOpenLocationRef && (
            <div
              ref={locationRef}
              className="d-flex flex-column bg-white p-4 position-absolute shadow-lg"
              style={{
                borderRadius: "8px",
                width: "380px",
                zIndex: 1000,
              }}
            >
              <span className="mb-2">지역</span>
              <div className="d-flex">
                {/* 시/도 */}
                <div
                  className="d-flex flex-column overflow-auto"
                  style={{ height: "300px" }}
                >
                  {/* {locationList.map((loc, i) => (
                    <button
                      key={i}
                      className={`text-start border-0 ${
                        city === loc.city ? "bg-primary text-white" : "bg-white"
                      } ps-2 py-2`}
                      style={{ fontSize: "14px", borderRadius: "8px" }}
                      onClick={() => setLocation({ ...location, city: loc.city })}
                    >
                      {loc.city}
                    </button>
                  ))}
                </div> */}
                  {locationList.map((v, i) => (
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

                {/* 구/군 */}
                <div
                  className="d-flex flex-column overflow-auto"
                  style={{ width: "160px", height: "300px" }}
                >
                  {/* {areaList.map((area, i) => (
                    <button
                      key={i}
                      className={`text-start border-0 ${
                        location.area === area
                          ? "bg-primary text-white"
                          : "bg-white"
                      } ps-2 py-2`}
                      style={{ fontSize: "14px", borderRadius: "8px" }}
                      onClick={() => handleLocationSelect(area)}
                    >
                      {area}
                    </button>
                  ))} */}
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
        </div>

        {/* 관심사 */}
        <div style={boxStyle}>
          <label className="label-text">관심사</label>
          <div className="d-flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                className="btn"
                style={{
                  borderColor: "#F9B4ED",
                  color: crew.crewCategory === cat ? "#FFFFFF" : "#333333",
                  backgroundColor:
                    crew.crewCategory === cat ? "#F9B4ED" : "#FFFFFF",
                  borderRadius: "8px",
                }}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 제출 버튼 */}
        <div style={boxStyle}>
          <button className="blue-btn" onClick={handleSubmit}>
            수정하기
          </button>
        </div>
      </div>
    </>
  );
}
