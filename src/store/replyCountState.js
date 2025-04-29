import { atom } from "recoil";

export const replyCountState = atom({
  key: "replyCountState",
  default: {}, // { boardNo: 댓글 수 }
});