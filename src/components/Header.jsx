import { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoLocationSharp } from "react-icons/io5";

import categoryData from "../json/category.json";
import locationData from "../json/location.json";
import { useNavigate } from "react-router-dom";

const categoryOptions = categoryData;
const locationOptions = locationData;

export default function Header({
  input = true,
  loginState = "",
  location = null,
  setLocation = null,
}) {
  const [category, setCategory] = useState("전체");
  const [isOpenCategoryRef, setIsOpenCategoryRef] = useState(false);
  const [isOpenLocationRef, setIsOpenLocationRef] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const areaList = useMemo(() => {
    let list = null;
    locationData.forEach((v) => {
      list = v.city === location.city ? v.area : list;
    });
    return list;
  }, [location]);

  const categoryRef = useRef(null);
  const locationRef = useRef(null);
  const searchRef = useRef(null);

  const navigate = useNavigate("/signin");

  useEffect(() => {
    // console.log(searchKeyword);
  }, [searchKeyword]);

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
  }, [locationRef]);

  return (
    <div
      className="w-100 bg-white position-fixed d-flex justify-content-between align-items-center shadow-sm"
      style={{
        paddingLeft: "120px",
        paddingRight: "120px",
        height: "70px",
        zIndex: 1,
      }}
    >
      <img src="/images/logo.svg" />

      {input && (
        <div className="d-flex gap-3">
          <div>
            <button
              className="bg-white border border-1 ps-3 py-2 d-flex justify-content-between align-items-center"
              style={{
                borderRadius: "8px",
                width: "164px",
                color: "#111111",
                borderColor: "#EBEBEB",
              }}
              onClick={() => {
                setIsOpenCategoryRef(true);
              }}
            >
              <div className="d-flex align-items-center gap-2">{category}</div>
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
                          category === v ? "bg-primary text-white" : "bg-white"
                        } ps-2 pe-4 py-2`}
                        style={{ fontSize: "14px", borderRadius: "8px" }}
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

          <div>
            <button
              className="bg-white border border-1 ps-3 py-2 d-flex justify-content-between align-items-center"
              style={{
                borderRadius: "8px",
                width: "164px",
                color: "#111111",
                borderColor: "#EBEBEB",
              }}
              onClick={() => {
                setIsOpenLocationRef(true);
              }}
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
                        style={{ fontSize: "14px", borderRadius: "8px" }}
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
                        style={{ fontSize: "14px", borderRadius: "8px" }}
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

          <div
            className="d-flex align-items-center ps-3 pe-3"
            style={{ backgroundColor: "#F1F3F5", borderRadius: "8px" }}
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
                width: "500px",
                outline: 0,
                color: "#111111",
                borderRadius: "8px",
                backgroundColor: "#F1F3F5",
              }}
            />
            <FaSearch size={18} />
          </div>
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
  );
}
