import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { windowWidthState } from "../utils/storage";

import { FaSearch } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoLocationSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

import categoryData from "../json/category.json";
import locationData from "../json/location.json";

const categoryOptions = categoryData;
const locationOptions = locationData;

export default function Header({
  input = true,
  loginState = "",
  category = null,
  setCategory = null,
  location = null,
  setLocation = null,
}) {
  const windowWidth = useRecoilValue(windowWidthState);
  const [isOpenCategoryRef, setIsOpenCategoryRef] = useState(false);
  const [isOpenLocationRef, setIsOpenLocationRef] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isOpenSearchRef, setIsOpenSearchRef] = useState(false);

  const areaList = useMemo(() => {
    if (location !== null) {
      let list = null;
      locationData.forEach((v) => {
        list = v.city === location.city ? v.area : list;
      });
      return list;
    }
  }, [location]);

  const categoryRef = useRef(null);
  const locationRef = useRef(null);
  const searchRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    // console.log(searchKeyword);
  }, [searchKeyword]);

  useEffect(() => {
    category
      ? localStorage.setItem("category", category)
      : localStorage.removeItem("category");
  }, [category]);

  useEffect(() => {
    location?.city
      ? localStorage.setItem("city", location.city)
      : localStorage.removeItem("city");
    location?.area
      ? localStorage.setItem("area", location.area)
      : localStorage.removeItem("area");
  }, [location]);

  useEffect(() => {
    const clickCategoryRefOutside = (e) => {
      if (!categoryRef.current?.contains(e.target)) {
        setIsOpenCategoryRef(false);
      }
    };

    const clickLocationRefOutside = (e) => {
      if (!locationRef.current?.contains(e.target)) {
        setIsOpenLocationRef(false);
      }
    };

    document.addEventListener("mousedown", clickCategoryRefOutside);
    document.addEventListener("mousedown", clickLocationRefOutside);

    return () => {
      document.removeEventListener("mousedown", clickCategoryRefOutside);
      document.removeEventListener("mousedown", clickLocationRefOutside);
    };
  }, [categoryRef, locationRef]);

  return (
    <div
      className="w-100 bg-white position-fixed d-flex justify-content-between align-items-center shadow-sm"
      style={{
        paddingLeft: "8.33%",
        paddingRight: "8.33%",
        height: "70px",
        zIndex: 1,
      }}
    >
      {!isOpenSearchRef ? (
        <>
          <button className="border-0 btn" onClick={() => navigate("/")}>
            <img src="/images/logo.svg" />
          </button>

          <div className="d-flex">
            {input && (
              <div className="d-flex gap-3" style={{ marginRight: "3vw" }}>
                {windowWidth > 768 && (
                  <div>
                    <button
                      className="bg-white border border-1 ps-3 py-2 d-flex justify-content-between align-items-center"
                      style={{
                        borderRadius: "8px",
                        width: "124px",
                        color: "#111111",
                        borderColor: "#EBEBEB",
                      }}
                      onClick={() => {
                        setIsOpenCategoryRef(true);
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        {category}
                      </div>
                      <RiArrowDropDownLine size={22} />
                    </button>
                    {isOpenCategoryRef && (
                      <div
                        ref={categoryRef}
                        className="d-flex flex-column bg-white p-4 position-absolute shadow-lg"
                        style={{ borderRadius: "8px" }}
                      >
                        <span className="mb-4">카테고리</span>
                        <div className="d-flex">
                          <div
                            className="d-flex flex-column overflow-auto"
                            style={{ height: "300px" }}
                          >
                            {categoryOptions.map((v, i) => (
                              <button
                                key={i}
                                className={`text-start border-0 ${
                                  category === v
                                    ? "bg-primary text-white"
                                    : "bg-white"
                                } ps-2 pe-4 py-2`}
                                style={{
                                  fontSize: "14px",
                                  borderRadius: "8px",
                                }}
                                onClick={() => setCategory(v)}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {windowWidth > 768 && (
                  <div>
                    <button
                      className="bg-white border border-1 ps-3 py-2 d-flex justify-content-between align-items-center"
                      style={{
                        borderRadius: "8px",
                        width: "136px",
                        color: "#111111",
                        borderColor: "#EBEBEB",
                      }}
                      onClick={() => setIsOpenLocationRef(true)}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <IoLocationSharp size={20} color="#6C757D" />
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
                                onClick={() =>
                                  setLocation({
                                    ...location,
                                    city: v.city,
                                  })
                                }
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
                                onClick={() =>
                                  setLocation({
                                    ...location,
                                    area: v,
                                  })
                                }
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {windowWidth > 1280 ? (
                  <div
                    className="d-flex align-items-center ps-3 pe-3"
                    style={{
                      backgroundColor: "#F1F3F5",
                      borderRadius: "8px",
                    }}
                  >
                    <input
                      ref={searchRef}
                      type="text"
                      className="h-100 ps-0 pe-2 border-0"
                      placeholder="찾을 모임을 검색해보세요!"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setSearchKeyword(e.target.value);
                        }
                      }}
                      style={{
                        width: "400px",
                        outline: 0,
                        color: "#111111",
                        borderRadius: "8px",
                        backgroundColor: "#F1F3F5",
                      }}
                    />
                    <FaSearch size={18} />
                  </div>
                ) : (
                  <>
                    <button
                      className="border-0 bg-white d-flex align-items-center"
                      onClick={() => setIsOpenSearchRef(true)}
                    >
                      <FaSearch size={18} color="#6C757D" />
                    </button>
                  </>
                )}
              </div>
            )}
            {loginState === "login" ? (
              <button
                className="btn btn-primary"
                style={{ paddingTop: "7px", paddingBottom: "7px" }}
                onClick={() => navigate("/signin")}
              >
                로그인
              </button>
            ) : loginState === "loggined" ? (
              <button className="bg-white p-2 border-0">
                <IoPersonCircle size={22} color="#6C757D" />
              </button>
            ) : null}
          </div>
        </>
      ) : (
        <div
          className={`${
            isOpenSearchRef ? "d-flex w-100" : "d-none"
          } justify-content-between align-items-center ps-3 pe-3`}
          style={{
            height: "42px",
            backgroundColor: "#F1F3F5",
            borderRadius: "8px",
          }}
        >
          <input
            ref={searchRef}
            type="text"
            className={`d-flex ps-0 pe-2 border-0`}
            placeholder="찾을 모임을 검색해보세요!"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchKeyword(e.target.value);
              }
            }}
            style={{
              width: "400px",
              outline: 0,
              color: "#111111",
              borderRadius: "8px",
              backgroundColor: "#F1F3F5",
            }}
          />
          <button
            className="border-0 bg-transparent d-flex align-items-center"
            onClick={() => setIsOpenSearchRef(false)}
          >
            <IoClose size={18} color="#6C757D" />
          </button>
        </div>
      )}
    </div>
  );
}
