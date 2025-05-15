import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import Header from "../components/Header";
import GroupItem from "../components/GroupItem";
import JoinBoardItem from "../components/JoinBoardItem";
import {
  locationState,
  windowWidthState,
  loginState,
  userNoState,
  categoryState,
} from "../utils/storage";

import { IoLocationSharp } from "react-icons/io5";

export default function Home() {
  const windowWidth = useRecoilValue(windowWidthState);
  const login = useRecoilValue(loginState);
  const userNo = useRecoilValue(userNoState);
  const [category, setCategory] = useRecoilState(categoryState);
  const [location, setLocation] = useRecoilState(locationState);
  const [keyword, setKeyword] = useState("");
  const [isAroundMore, setIsAroundMore] = useState(false);
  const [aroundRenderItem, setAroundRenderItem] = useState(6);
  const [aroundGroupData, setAroundGroupData] = useState([]);
  const [isLikedMore, setIsLikedMore] = useState(false);
  const [likedRenderItem, setLikedRenderItem] = useState(6);
  const [likedGroupData, setLikedGroupData] = useState([]);
  const [joinBoardData, setJoinBoardData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:8080/api/board/joinboard");
      setJoinBoardData([...res.data]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (keyword !== "") navigate(`/crew/list?keyword=${keyword}`);
  }, [keyword]);

  useEffect(() => {
    setIsAroundMore(aroundGroupData.length > aroundRenderItem);
  }, [location, aroundRenderItem, aroundGroupData]);

  useEffect(() => {
    setIsLikedMore(likedGroupData.length > likedRenderItem);
  }, [location, likedRenderItem, likedGroupData]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post("http://localhost:8080/api/crew/search", {
        memberNo: userNo,
        category,
        location: `${location.city} ${location.area}`,
      });
      setAroundGroupData([...res.data]);
    };
    fetchData();
  }, [userNo, category, location]);

  useEffect(() => {
    if (userNo) {
      const fetchData = async () => {
        const res = await axios.get(
          `http://localhost:8080/api/crew/findLikedGroup/${userNo}`
        );
        setLikedGroupData([...res.data]);
      };
      fetchData();
    }
  }, [userNo]);

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
          <IoLocationSharp color="#DABFFF" size={20} className="me-2" />
          <span style={{ color: "#F9B4ED" }}>
            {`${location.city} ${location.area}`}
          </span>
          &nbsp;근처 모임
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
          {aroundGroupData.length ? (
            aroundGroupData.map((group, idx) => {
              return (
                idx < aroundRenderItem && (
                  <GroupItem key={idx} data={group} userNo={userNo} />
                )
              );
            })
          ) : (
            <span className="fs-5 fw-bold" style={{ color: "#333333" }}>
              근처 모임이 없습니다.
            </span>
          )}
        </div>
        {isAroundMore && (
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
                setAroundRenderItem((aroundRenderItem) => aroundRenderItem + 6)
              }
            >
              모임 더보기
            </button>
          </div>
        )}

        {login && (
          <>
            <div
              style={{ marginTop: "120px", marginBottom: "40px" }}
              className="d-flex align-items-center fw-bold fs-4"
            >
              나의 관심사와 일치하는 모임
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
              {likedGroupData.length ? (
                likedGroupData.map((group, idx) => {
                  return (
                    idx < likedRenderItem && (
                      <GroupItem key={idx} data={group} />
                    )
                  );
                })
              ) : (
                <span className="fs-5 fw-bold" style={{ color: "#333333" }}>
                  관심사와 일치하는 모임이 없습니다.
                </span>
              )}
            </div>
            {isLikedMore && (
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
                    setLikedRenderItem((likedRenderItem) => likedRenderItem + 6)
                  }
                >
                  모임 더보기
                </button>
              </div>
            )}
          </>
        )}

        <div
          style={{ marginTop: "120px", marginBottom: "40px", color: "#111111" }}
          className="d-flex align-items-center fw-bold fs-4"
        >
          모임 가입 게시판
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `${
              windowWidth > 1024 ? "repeat(2, 1fr)" : "repeat(1, 1fr)"
            }`,
            gap: "60px",
          }}
        >
          {joinBoardData.map((joinBoard, idx) => {
            return idx < 2 && <JoinBoardItem key={idx} data={joinBoard} />;
          })}
        </div>

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
            onClick={() => navigate("/join/board")}
          >
            게시판 더보기
          </button>
        </div>
      </div>
    </>
  );
}
