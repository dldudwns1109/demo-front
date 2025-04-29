// src/utils/storage.js
import { atom } from "recoil";

export const userIdState = atom({
  key: "userIdState",
  default: null,
});

export const locationState = atom({
  key: "locationState",
  default: {
    city: "서울특별시",
    area: "강남구",
  },
});

export const windowWidthState = atom({
  key: "windowWidthState",
  default: window.innerWidth,
});
