import { useEffect, useState } from "react";
import Header from "../components/Header";
import GroupItem from "../components/GroupItem";

import { IoLocationSharp } from "react-icons/io5";
import JoinBoardItem from "../components/JoinBoardItem";
import { useNavigate } from "react-router-dom";

const aroundGroupData = [
  {
    img: "https://picsum.photos/seed/dsda/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
];

const likedGroupData = [
  {
    img: "https://picsum.photos/seed/dsda/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/seed/picsum/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
  {
    img: "https://picsum.photos/360/270",
    isLiked: false,
    title: "Photoism 사진 모임",
    content: "사진 찍는 것을 좋아하는 20대 환영합니다!",
    category: "사교",
    location: "김포시",
    member: "32",
  },
];

const joinBoardItem = [
  {
    title: "풋살 모임 찾아요~",
    img: "https://picsum.photos/360/270",
    username: "누구냐넌",
    gender: "남자",
    birth: "2001.04.21",
    mbti: "ENFP",
    like: "스포츠",
    context:
      "서울 양천구나 강서구 근처에서 활동 중인 풋살 모임을 찾고 있어요~! 멤버 영입에 관심있으시면 연락주세요!",
  },
  {
    title: "풋살 모임 찾아요~",
    img: "https://picsum.photos/360/270",
    username: "누구냐넌",
    gender: "남자",
    birth: "2001.04.21",
    mbti: "ENFP",
    like: "스포츠",
    context:
      "서울 양천구나 강서구 근처에서 활동 중인 풋살 모임을 찾고 있어요~! 멤버 영입에 관심있으시면 연락주세요!",
  },
  {
    title: "풋살 모임 찾아요~",
    img: "https://picsum.photos/360/270",
    username: "누구냐넌",
    gender: "남자",
    birth: "2001.04.21",
    mbti: "ENFP",
    like: "스포츠",
    context:
      "서울 양천구나 강서구 근처에서 활동 중인 풋살 모임을 찾고 있어요~! 멤버 영입에 관심있으시면 연락주세요!",
  },
  {
    title: "풋살 모임 찾아요~",
    img: "https://picsum.photos/360/270",
    username: "누구냐넌",
    gender: "남자",
    birth: "2001.04.21",
    mbti: "ENFP",
    like: "스포츠",
    context:
      "서울 양천구나 강서구 근처에서 활동 중인 풋살 모임을 찾고 있어요~! 멤버 영입에 관심있으시면 연락주세요!",
  },
  {
    title: "풋살 모임 찾아요~",
    img: "https://picsum.photos/360/270",
    username: "누구냐넌",
    gender: "남자",
    birth: "2001.04.21",
    mbti: "ENFP",
    like: "스포츠",
    context:
      "서울 양천구나 강서구 근처에서 활동 중인 풋살 모임을 찾고 있어요~! 멤버 영입에 관심있으시면 연락주세요!",
  },
  {
    title: "풋살 모임 찾아요~",
    img: "https://picsum.photos/360/270",
    username: "누구냐넌",
    gender: "남자",
    birth: "2001.04.21",
    mbti: "ENFP",
    like: "스포츠",
    context:
      "서울 양천구나 강서구 근처에서 활동 중인 풋살 모임을 찾고 있어요~! 멤버 영입에 관심있으시면 연락주세요!",
  },
];

export default function Home() {
  const [location, setLocation] = useState({
    city: "서울특별시",
    area: "강남구",
  });
  const [isAroundMore, setIsAroundMore] = useState(false);
  const [aroundRenderItem, setAroundRenderItem] = useState(6);

  const [isLikedMore, setIsLikedMore] = useState(false);
  const [likedRenderItem, setLikedRenderItem] = useState(6);

  const navigate = useNavigate();

  useEffect(() => {
    setIsAroundMore(aroundGroupData.length > aroundRenderItem);
  }, [location, aroundRenderItem]);

  useEffect(() => {
    setIsLikedMore(likedGroupData.length > likedRenderItem);
  }, [location, likedRenderItem]);

  return (
    <>
      <Header
        loginState="login"
        location={location}
        setLocation={setLocation}
      />
      <div
        style={{
          paddingTop: "70px",
          paddingBottom: "80px",
          paddingLeft: "120px",
          paddingRight: "120px",
        }}
      >
        <div
          style={{ marginTop: "80px", marginBottom: "40px", color: "#111111" }}
          className="d-flex align-items-center fw-bold fs-4"
        >
          <IoLocationSharp color="#DABFFF" size={20} className="me-2" />
          <span style={{ color: "#F9B4ED" }}>{location.area}</span>
          &nbsp;근처 모임
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "60px",
          }}
        >
          {aroundGroupData.map((group, idx) => {
            return (
              idx < aroundRenderItem && <GroupItem key={idx} data={group} />
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

        <div
          style={{ marginTop: "120px", marginBottom: "40px" }}
          className="d-flex align-items-center fw-bold fs-4"
        >
          나의 관심사와 일치하는 모임
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
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

        <div
          style={{ marginTop: "120px", marginBottom: "40px", color: "#111111" }}
          className="d-flex align-items-center fw-bold fs-4"
        >
          모임 가입 게시판
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "60px",
          }}
        >
          {joinBoardItem.map((joinBoard, idx) => {
            joinBoard.context =
              joinBoard.context.length >= 53 &&
              joinBoard.context.slice(0, 53) + "...";
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
