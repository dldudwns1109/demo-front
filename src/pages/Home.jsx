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

const joinBoardItem = [
  {
    title: "풋살 모임 찾아요~",
    img: "https://picsum.photos/seed/16/360/270",
    username: "축구왕박지성",
    gender: "남자",
    birth: "2001.04.21",
    mbti: "ENFP",
    like: "스포츠",
    context:
      "서울 양천구나 강서구 근처에서 활동 중인 풋살 모임을 찾고 있어요~! 매주 토요일 오후에 시간 되시는 분들이면 좋겠어요. 실력은 중요하지 않아요, 즐겁게 운동할 수 있는 분들 환영합니다!",
  },
  {
    title: "독서모임 멤버 구해요",
    img: "https://picsum.photos/seed/17/360/270",
    username: "책벌레",
    gender: "여자",
    birth: "1995.09.14",
    mbti: "INTJ",
    like: "독서",
    context:
      "경기도 일산에서 한 달에 한 번 만나는 독서모임을 운영 중입니다. 주로 소설과 에세이를 읽고 이야기 나누고 있어요. 책 읽는 걸 좋아하시는 분들이라면 누구든지 환영해요!",
  },
];

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

  const navigate = useNavigate();

  useEffect(() => {
    if (keyword !== "") navigate(`/crew/list?keyword=${keyword}`);
  }, [keyword]);

  useEffect(() => {
    setIsAroundMore(aroundGroupData.length > aroundRenderItem);
  }, [location, aroundRenderItem]);

  useEffect(() => {
    setIsLikedMore(likedGroupData.length > likedRenderItem);
  }, [location, likedRenderItem]);

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
          {aroundGroupData.map((group, idx) => {
            return (
              idx < aroundRenderItem && (
                <GroupItem key={idx} data={group} userNo={userNo} />
              )
            );
          })}
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
              {likedGroupData.map((group, idx) => {
                return (
                  idx < likedRenderItem && <GroupItem key={idx} data={group} />
                );
              })}
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
          {joinBoardItem.map((joinBoard, idx) => {
            joinBoard.context =
              joinBoard.context.length >= 60 &&
              joinBoard.context.slice(0, 60) + "...";
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
