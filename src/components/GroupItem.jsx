import { useState, useEffect } from "react";

import { IoLocationSharp } from "react-icons/io5";
import { IoPeople } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";

export default function GroupItem({ data }) {
  const [toggle, setToggle] = useState(data.isLiked);

  return (
    <div className="d-flex flex-column" style={{ cursor: "pointer" }}>
      <div className="position-relative" style={{ marginBottom: "12px" }}>
        <img src={data.img} className="w-100" style={{ borderRadius: "8px" }} />
        <button
          className="d-flex justify-content-center align-items-center position-absolute border-0 p-2 bg-white"
          style={{
            right: "8px",
            bottom: "8px",
            borderRadius: "999px",
            width: "36px",
            height: "36px",
          }}
          onClick={() => setToggle((toggle) => !toggle)}
        >
          {toggle ? (
            <IoHeartSharp size={20} color="#DC3545" />
          ) : (
            <IoHeartOutline size={20} />
          )}
        </button>
      </div>
      <span className="fs-5 fw-bold mb-2" style={{ color: "#111111" }}>
        {data.title}
      </span>
      <p
        style={{
          fontSize: "14px",
          color: "#333333",
          marginBottom: "12px",
        }}
      >
        {data.content}
      </p>
      <div
        className="d-flex align-items-center gap-1"
        style={{ color: "#666666" }}
      >
        <IoPeople size={18} color="#6C757D" />
        <span>{data.category}</span> ·
        <IoLocationSharp size={18} color="#6C757D" />
        <span>{data.location}</span> · <span>회원 {data.member}명</span>
      </div>
    </div>
  );
}
