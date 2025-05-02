// src/utils/storage.js
import { atom, selector } from "recoil";

export const userNoState = atom({
  key: "userNoState",
  default: null,
});

export const categoryState = atom({
  key: "categoryState",
  default: localStorage.getItem("category") ?? "전체",
});

export const locationState = atom({
  key: "locationState",
  default: {
    city: localStorage.getItem("city") ?? "서울특별시",
    area: localStorage.getItem("area") ?? "강남구",
  },
});

export const windowWidthState = atom({
  key: "windowWidthState",
  default: window.innerWidth,
});

export const loginState = selector({
  key: "loginState",
  get: (state) => state.get(userNoState) !== null,
});

export const userProfileState = atom({
  key: "userProfileState",
  default: {
    memberNo: null, //로그인 여부 판단용
    nickname: "",
    profileUrl: "",
    gender: "",
    birth: "",
    mbti: "",
    location: "",
    school: "",
  },
});
