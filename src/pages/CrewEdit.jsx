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
    "자기개발",
    "요리",
  ];

  const getAuthHeaders = () => {
    const token = localStorage.getItem("refreshToken");
    return { Authorization: `Bearer ${token.trim()}` };
  };

  /* 모임장 여부 확인 */
  // const checkLeaderStatus = async () => {
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:8080/api/crewmember/${crewNo}/leader`,
  //       {
  //         headers: getAuthHeaders(),
  //       }
  //     );
  //     setIsLeader(res.data);
  //   } catch (err) {
  //     console.error("Error checking leader status:", err.message);
  //   }
  // };

  const checkLeaderStatus = async () => {
    try {
      if (!login || !userNo) {
        alert("권한이 없습니다.");
        navigate(`/crew/${crewNo}/detail`);
        return;
      }

      const headers = getAuthHeaders();
      const res = await axios.get(
        `http://localhost:8080/api/crewmember/${crewNo}/leader`,
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
      const res = await axios.get(`http://localhost:8080/api/crew/${crewNo}`);
      const crewData = res.data;

      const [city, area] = crewData.crewLocation.split(" ");

      setCrew({
        crewName: crewData.crewName,
        crewCategory: crewData.crewCategory,
        crewLocation: crewData.crewLocation,
        crewIntro: crewData.crewIntro,
        crewImage: `http://localhost:8080/api/crew/image/${crewNo}`,
      });

      setLocation({ city, area });
      setImagePreview(`http://localhost:8080/api/crew/image/${crewNo}`);
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

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };

  /** 이미지 클릭 시 파일 선택 */
  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setCrew((prev) => ({ ...prev, [name]: value }));
  // };
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

  // const handleSubmit = async () => {
  //   if (!crew.crewName.trim() || !crew.crewIntro.trim()) {
  //     alert("모임명과 소개를 모두 입력해주세요.");
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     Object.entries(crew).forEach(([key, value]) => {
  //       formData.append(key, value);
  //     });

  //     if (selectedFile) {
  //       formData.append("crewImage", selectedFile);
  //     }

  //     await axios.patch(`http://localhost:8080/api/crew/${crewNo}`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     alert("모임이 수정되었습니다.");
  //     navigate(`/crew/${crewNo}/detail`);
  //   } catch (err) {
  //     console.error("Error updating crew:", err.message);
  //     alert("모임 수정에 실패했습니다.");
  //   }
  // };

  const handleSubmit = async () => {
    if (!crew.crewName.trim() || !crew.crewIntro.trim()) {
      alert("모임명과 소개를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/crew/${crewNo}`,
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

  return (
    <>
      <Header loginState={`${login ? "loggined" : "login"}`} input={false} />
      <div
        className="d-flex flex-column align-items-center"
        style={{ paddingTop: "70px", paddingBottom: "80px" }}
      >
        <div style={{ marginBottom: "48px", marginTop: "80px" }}>
          <span
            style={{ fontSize: "24px", fontWeight: "bold", color: "#111111" }}
          >
            모임 수정
          </span>
        </div>
        <div>
          <img
            src={imagePreview}
            onClick={openFileSelector}
            className="memberProfile"
            style={{
              cursor: "pointer",
            }}
            alt="모임 이미지"
          />
        </div>
        {/* <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          /> */}
        <input
          type="file"
          className="form-control"
          name="crewImg"
          accept=".png, .jpg"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">모임명</label>
          <input
            className="member-input"
            name="crewName"
            value={crew.crewName}
            onChange={handleInputChange}
            style={{
              borderColor: crewNameError ? "#dc3545" : "#ced4da", 
            }}
          />
          {crewNameError && (
            <div className="text-danger" style={{ marginTop: "4px" }}>
              {crewNameError}
            </div>
          )}
        </div>
        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">모임 소개</label>
          <textarea
            style={{ width: "360px", height: "300px", margin: "0 auto" }}
            name="crewIntro"
            value={crew.crewIntro}
            rows="20"
            onChange={handleInputChange}
          />
        </div>

        <div style={{ width: "360px", margin: "0 auto", marginBottom: "16px" }}>
          <label className="label-text">활동 지역</label>
          <div>
            <button
              className="w-100 bg-white border border-1 ps-3 py-2 d-flex justify-content-between align-items-center"
              style={{
                borderRadius: "8px",
                color: "#111111",
                borderColor: "#EBEBEB",
              }}
              // onClick={() => setIsOpenLocationRef(true)}
              onClick={() => setIsOpenLocationRef(!isOpenLocationRef)}
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

                  {/* 지역 목록 */}
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
          </div>
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
            {categories.map((like) => (
              <button
                key={like}
                className={`mbti-badge ${
                  crew.crewCategory === like ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(like)}
                type="button"
              >
                {like}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: "360px", margin: "0 auto" }}>
          <button
            className={isLeader ? "blue-btn" : "light-gray-btn"}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            onClick={handleSubmit}
            disabled={!isLeader}
          >
            수정하기
          </button>
        </div>
      </div>
    </>
  );
}
