import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import axios from "axios";

import { IoLocationSharp } from "react-icons/io5";
import { IoPeople } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";
import { userNoState } from "../utils/storage";

export default function GroupItem({ data }) {
  const userNo = useRecoilValue(userNoState);
  const [toggle, setToggle] = useState(data.crewIsLiked);

  const navigate = useNavigate();

  useEffect(() => {
    setToggle(data.crewIsLiked);
  }, [data.crewIsLiked]);

  return (
    <div
      className="d-flex flex-column"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/crew/${data.crewNo}/detail`)}
    >
      <div className="position-relative" style={{ marginBottom: "12px" }}>
        <img
          src={`http://localhost:8080/api/attachment/${data.crewAttachmentNo}`}
          className="w-100"
          style={{
            borderRadius: "8px",
            objectFit: "cover",
            height: "270px",
          }}
        />
        <button
          className="d-flex justify-content-center align-items-center position-absolute border-0 p-2 bg-white"
          style={{
            right: "8px",
            bottom: "8px",
            borderRadius: "999px",
            width: "36px",
            height: "36px",
          }}
          onClick={async (e) => {
            e.stopPropagation();

            if (toggle) {
              await axios.delete("http://localhost:8080/api/crew/deleteLike", {
                data: {
                  memberNo: userNo,
                  crewNo: data.crewNo,
                },
              });
            } else {
              await axios.post("http://localhost:8080/api/crew/updateLike", {
                memberNo: userNo,
                crewNo: data.crewNo,
              });
            }
            setToggle((toggle) => !toggle);
          }}
        >
          {toggle ? (
            <IoHeartSharp size={20} color="#DC3545" />
          ) : (
            <IoHeartOutline size={20} />
          )}
        </button>
      </div>
      <span className="fs-5 fw-bold mb-2" style={{ color: "#111111" }}>
        {data.crewName}
      </span>
      <p
        style={{
          fontSize: "14px",
          color: "#333333",
          marginBottom: "12px",
        }}
      >
        {data.crewIntro.length > 45
          ? data.crewIntro.slice(0, 45) + "..."
          : data.crewIntro}
      </p>
      <div
        className="d-flex flex-wrap align-items-center gap-1"
        style={{ color: "#666666" }}
      >
        <IoPeople size={18} color="#6C757D" />
        <span>{data.crewCategory}</span> ·
        <IoLocationSharp size={18} color="#6C757D" />
        <span>{data.crewLocation}</span> ·{" "}
        <span>회원 {data.crewMemberCnt}명</span>
      </div>
    </div>
  );
}
