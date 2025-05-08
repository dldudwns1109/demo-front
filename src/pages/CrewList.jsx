import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import Header from "../components/Header";
import GroupItem from "../components/GroupItem";
import {
  locationState,
  windowWidthState,
  loginState,
  userNoState,
  categoryState,
} from "../utils/storage";

export default function CrewList() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const windowWidth = useRecoilValue(windowWidthState);
  const login = useRecoilValue(loginState);
  const userNo = useRecoilValue(userNoState);
  const [category, setCategory] = useRecoilState(categoryState);
  const [location, setLocation] = useRecoilState(locationState);
  const [keyword, setKeyword] = useState(queryParams.get("keyword"));
  const [isSearchMore, setIsSearchMore] = useState(false);
  const [searchRenderItem, setSearchRenderItem] = useState(6);
  const [searchGroupData, setSearchGroupData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (keyword !== "") navigate(`/crew/list?keyword=${keyword}`);
  }, [category, location, keyword]);

  useEffect(() => {
    setIsSearchMore(searchGroupData.length > searchRenderItem);
  }, [location, searchRenderItem]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post("http://localhost:8080/api/crew/search", {
        memberNo: userNo,
        category,
        location: `${location.city} ${location.area}`,
        keyword,
      });
      setSearchGroupData([...res.data]);
    };
    fetchData();
  }, [userNo, keyword, category, location]);

  return (
    <>
      <Header
        loginState={`${login ? "loggined" : "login"}`}
        category={category}
        setCategory={setCategory}
        location={location}
        setLocation={setLocation}
        searchKeyword={keyword}
        setSearchKeyword={setKeyword}
      />
      <div
        style={{
          paddingTop: "70px",
          paddingBottom: "80px",
          paddingLeft: "8.33%",
          paddingRight: "8.33%",
        }}
      >
        <div
          style={{ marginTop: "80px", marginBottom: "40px", color: "#111111" }}
          className="d-flex align-items-center fw-bold fs-4"
        >
          {keyword === "" ? (
            <>
              <span style={{ color: "#F9B4ED" }}>전체</span>
              &nbsp;검색 결과
            </>
          ) : (
            <>
              "<span style={{ color: "#F9B4ED" }}>{`${keyword}`}</span>"
              &nbsp;검색 결과
            </>
          )}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `${
              windowWidth > 1024
                ? "repeat(3, 1fr)"
                : windowWidth > 768
                ? "repeat(2, 1fr)"
                : "repeat(1, 1fr)"
            }`,
            gap: "60px",
          }}
        >
          {searchGroupData.length ? (
            searchGroupData.map((group, idx) => {
              return (
                idx < searchRenderItem && (
                  <GroupItem key={idx} data={group} userNo={userNo} />
                )
              );
            })
          ) : (
            <div>
              <span className="fs-5 fw-bold" style={{ color: "#111111" }}>
                검색 결과가 없습니다.
              </span>
            </div>
          )}
        </div>
        {isSearchMore && (
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "60px" }}
          >
            <button
              className="border-0 bg-primary text-white"
              style={{
                borderRadius: "8px",
                paddingLeft: "12px",
                paddingRight: "12px",
                paddingTop: "7px",
                paddingBottom: "7px",
              }}
              onClick={() =>
                setSearchRenderItem((searchRenderItem) => searchRenderItem + 6)
              }
            >
              모임 더보기
            </button>
          </div>
        )}
      </div>
    </>
  );
}
