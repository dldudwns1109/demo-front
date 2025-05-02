import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
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
import axios from "axios";

// const likedGroupData = [
//   {
//     img: "https://picsum.photos/seed/1/360/270",
//     isLiked: false,
//     title: "Photoism 사진 모임",
//     content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
//     category: "사교",
//     location: "김포시",
//     member: "32",
//   },
//   {
//     img: "https://picsum.photos/seed/2/360/270",
//     isLiked: true,
//     title: "책향기 독서모임",
//     content: "매주 일요일 오후 2시, 함께 책을 읽고 토론해요",
//     category: "독서",
//     location: "강남구",
//     member: "15",
//   },
//   {
//     img: "https://picsum.photos/seed/3/360/270",
//     isLiked: false,
//     title: "코딩 스터디 그룹",
//     content: "프론트엔드 개발자를 꿈꾸는 사람들의 모임",
//     category: "자기계발",
//     location: "서초구",
//     member: "24",
//   },
//   {
//     img: "https://picsum.photos/seed/4/360/270",
//     isLiked: true,
//     title: "주말 등산 클럽",
//     content: "초보자도 부담없이 참여할 수 있는 등산 모임",
//     category: "스포츠",
//     location: "성남시",
//     member: "47",
//   },
//   {
//     img: "https://picsum.photos/seed/5/360/270",
//     isLiked: false,
//     title: "와인 테이스팅 모임",
//     content: "와인을 좋아하는 30대 모임입니다",
//     category: "사교",
//     location: "서대문구",
//     member: "19",
//   },
//   {
//     img: "https://picsum.photos/seed/6/360/270",
//     isLiked: true,
//     title: "볼링 친목 동호회",
//     content: "매주 수요일 저녁 함께 볼링 치며 스트레스 해소!",
//     category: "스포츠",
//     location: "부천시",
//     member: "28",
//   },
//   {
//     img: "https://picsum.photos/seed/6/360/270",
//     isLiked: false,
//     title: "영어회화 스터디",
//     content: "원어민과 함께하는 실전 영어회화 연습",
//     category: "자기계발",
//     location: "송파구",
//     member: "12",
//   },
//   {
//     img: "https://picsum.photos/seed/7/360/270",
//     isLiked: true,
//     title: "맛집 탐방 모임",
//     content: "서울 숨은 맛집을 함께 찾아다니는 푸드 소셜 클럽",
//     category: "사교",
//     location: "마포구",
//     member: "36",
//   },
//   {
//     img: "https://picsum.photos/seed/8/360/270",
//     isLiked: false,
//     title: "캘리그라피 클래스",
//     content: "아름다운 손글씨를 배우는 모임, 초보자 환영!",
//     category: "자기계발",
//     location: "용산구",
//     member: "21",
//   },
//   {
//     img: "https://picsum.photos/seed/9/360/270",
//     isLiked: true,
//     title: "테니스 동호회",
//     content: "주말마다 모여 테니스를 치는 생활체육 모임",
//     category: "스포츠",
//     location: "분당구",
//     member: "24",
//   },
//   {
//     img: "https://picsum.photos/seed/10/360/270",
//     isLiked: false,
//     title: "베이킹 클럽",
//     content: "함께 빵과 쿠키를 만드는 홈베이킹 모임",
//     category: "요리",
//     location: "일산동구",
//     member: "16",
//   },
//   {
//     img: "https://picsum.photos/seed/11/360/270",
//     isLiked: true,
//     title: "보드게임 친목회",
//     content: "다양한 보드게임을 즐기는 20-30대 모임",
//     category: "사교",
//     location: "중구",
//     member: "29",
//   },
//   {
//     img: "https://picsum.photos/seed/12/360/270",
//     isLiked: false,
//     title: "주식 투자 스터디",
//     content: "함께 공부하며 건전한 투자를 배우는 모임",
//     category: "자기계발",
//     location: "강서구",
//     member: "18",
//   },
//   {
//     img: "https://picsum.photos/seed/13/360/270",
//     isLiked: true,
//     title: "반려동물 모임",
//     content: "반려동물과 함께하는 산책 및 친목 모임",
//     category: "사교",
//     location: "관악구",
//     member: "34",
//   },
//   {
//     img: "https://picsum.photos/seed/14/360/270",
//     isLiked: false,
//     title: "영화 감상 클럽",
//     content: "매주 새로운 영화를 함께 보고 토론하는 모임",
//     category: "사교",
//     location: "광진구",
//     member: "22",
//   },
//   {
//     img: "https://picsum.photos/seed/15/360/270",
//     isLiked: true,
//     title: "자전거 라이딩 모임",
//     content: "한강을 따라 자전거를 타는 주말 라이딩 클럽",
//     category: "스포츠",
//     location: "양천구",
//     member: "41",
//   },
// ];

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
  const [isLikedMore, setIsLikedMore] = useState(false);
  const [likedRenderItem, setLikedRenderItem] = useState(6);
  const [aroundGroupData, setAroundGroupData] = useState([]);
  const [likedGroupData, setLikedGroupData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setIsAroundMore(aroundGroupData.length > aroundRenderItem);
  }, [location, aroundRenderItem]);

  useEffect(() => {
    setIsLikedMore(likedGroupData.length > likedRenderItem);
  }, [location, likedRenderItem]);

  useEffect(() => {
    console.log(aroundGroupData);
  }, [aroundGroupData]);

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
