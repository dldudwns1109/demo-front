// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { userIdState } from "../utils/storage";
// import { useRecoilValueLoadable } from "recoil";


// export default function JoinBoardDetail() {
//   const { boardNo } = useParams();
//   const navigate = useNavigate();

//   const loginIdLoadable = useRecoilValueLoadable(userIdState);
//   const loginId = loginIdLoadable.state === "hasValue" ? loginIdLoadable.contents : null;
//   const [board, setBoard] = useState(null);
//   const [replies, setReplies] = useState([]);
//   const [newReply, setNewReply] = useState("");

//   // 게시글 + 댓글 조회
//   useEffect(() => {
//     axios
//       .get(`/api/board/${boardNo}`)
//       .then((res) => setBoard(res.data))
//       .catch(() => alert("게시글을 불러오지 못했습니다."));

//     axios
//       .get(`/api/reply/${boardNo}`)
//       .then((res) => setReplies(res.data))
//       .catch(() => setReplies([]));
//   }, [boardNo]);

//   const handleDeleteBoard = () => {
//     if (loginId !== board.boardWriterId) {
//       window.confirm("수정 및 삭제는 작성자만 가능합니다");
//       return;
//     }

//     const ok = window.confirm("정말로 삭제하시겠습니까?");
//     if (!ok) return;

//     axios
//       .delete(`/api/board/${boardNo}`)
//       .then(() => navigate("/join/board"))
//       .catch(() => alert("삭제 실패"));
//   };

//   const handleReplySubmit = () => {
//     if (!loginId) {
//       alert("댓글은 로그인 후 작성할 수 있습니다.");
//       return;
//     }

//     axios
//       .post("/api/reply", {
//         replyOrigin: board.boardNo,
//         replyContent: newReply
//       })
//       .then(() => {
//         setNewReply("");
//         return axios.get(`/api/reply/${boardNo}`);
//       })
//       .then((res) => setReplies(res.data));
//   };

//   const handleReplyDelete = (reply) => {
//     if (loginId !== reply.replyWriterId && loginId !== board.boardWriterId) {
//       alert("삭제는 댓글 작성자 또는 게시글 작성자만 가능합니다.");
//       return;
//     }

//     const ok = window.confirm("댓글을 삭제하시겠습니까?");
//     if (!ok) return;

//     axios
//       .delete(`/api/reply/${reply.replyNo}`)
//       .then(() => setReplies((prev) => prev.filter((r) => r.replyNo !== reply.replyNo)));
//   };

//   const handleReplyEdit = (reply) => {
//     if (loginId !== reply.replyWriterId) {
//       alert("수정은 댓글 작성자만 가능합니다.");
//       return;
//     }

//     const newContent = prompt("수정할 내용을 입력하세요", reply.replyContent);
//     if (!newContent || newContent === reply.replyContent) return;

//     axios
//       .patch(`/api/reply/${reply.replyNo}`, {
//         replyContent: newContent
//       })
//       .then(() => {
//         return axios.get(`/api/reply/${boardNo}`);
//       })
//       .then((res) => setReplies(res.data));
//   };

//   if (!board) return <div className="text-center my-5">불러오는 중...</div>;

//   return (
//     <>
//     <div className="container py-4">
//       <h3 className="fw-bold mb-4">{board.boardTitle}</h3>

//       {/* 작성자 정보 + 메뉴 */}
//       <div className="d-flex justify-content-between align-items-start mb-3">
//         <div className="d-flex">
//           <img
//             src={board.boardWriterProfileUrl || "/images/default-profile.png"}
//             alt="프로필"
//             className="rounded-circle me-3"
//             style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer" }}
//             onClick={() =>
//               window.dispatchEvent(new CustomEvent("open-profile-modal", { detail: board.boardWriterNickname }))
//             }
//           />
//           <div>
//             <div className="d-flex align-items-center mb-1">
//               <strong className="me-2">{board.boardWriterNickname}</strong>
//               <span className="text-muted" style={{ fontSize: "0.85rem" }}>
//                 {board.boardWriteTime}
//               </span>
//             </div>
//             <div className="text-muted" style={{ fontSize: "0.85rem" }}>
//               {board.boardWriterGender === "M" ? "남성" : "여성"} · {board.boardWriterBirth} · {board.boardWriterMbti}
//             </div>
//           </div>
//         </div>

//         {/* 누구나 보이는 드롭다운 메뉴 */}
//         <div className="dropdown text-end">
//           <button className="btn" data-bs-toggle="dropdown">
//             <BsThreeDotsVertical />
//           </button>
//           <ul className="dropdown-menu">
//             <li>
//               <button
//                 className="dropdown-item"
//                 onClick={() => {
//                   if (loginId === board.boardWriterId) {
//                     navigate(`/join/board/edit/${board.boardNo}`);
//                   } else {
//                     window.confirm("수정 및 삭제는 작성자만 가능합니다");
//                   }
//                 }}
//               >
//                 수정
//               </button>
//             </li>
//             <li>
//               <button className="dropdown-item text-danger" onClick={handleDeleteBoard}>
//                 삭제
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* 카테고리 */}
//       <div className="mb-2 text-primary fw-bold">{board.boardCategory}</div>

//       {/* 본문 */}
//       <div className="mb-4" style={{ whiteSpace: "pre-line", fontSize: "1.05rem" }}>
//         {board.boardContent}
//       </div>

//       {/* 댓글 */}
//       <div className="border-top pt-4">
//         <h6 className="fw-bold mb-3">댓글</h6>

//         {replies.map((reply) => (
//           <div key={reply.replyNo} className="border rounded p-2 mb-2">
//             <div className="d-flex justify-content-between">
//               <div>
//                 <strong>{reply.replyWriterNickname}</strong>
//                 <div className="text-muted small">{reply.replyWtime}</div>
//               </div>
//               <div>
//                 <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => handleReplyEdit(reply)}>
//                   수정
//                 </button>
//                 <button className="btn btn-sm btn-outline-danger" onClick={() => handleReplyDelete(reply)}>
//                   삭제
//                 </button>
//               </div>
//             </div>
//             <div className="mt-2">{reply.replyContent}</div>
//           </div>
//         ))}

//         <div className="d-flex mt-4">
//           <input
//             type="text"
//             className="form-control me-2"
//             placeholder="댓글을 입력하세요"
//             value={newReply}
//             onChange={(e) => setNewReply(e.target.value)}
//           />
//           <button className="btn btn-primary" onClick={handleReplySubmit}>
//             등록
//           </button>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// }
