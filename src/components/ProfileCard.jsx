import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { Modal } from "bootstrap";
import { windowWidthState } from "../utils/storage";

import { FaCog } from "react-icons/fa";

import "../css/Mypage.css";

export default function ProfileCard({ member }) {
  const windowWidth = useRecoilValue(windowWidthState);

  const navigate = useNavigate();

  const modal = useRef();

  const openModal = useCallback(() => {
    const target = Modal.getOrCreateInstance(modal.current);
    target.show();
  }, []);

  const closeModal = useCallback(() => {
    const target = Modal.getInstance(modal.current);
    if (target !== null) target.hide();
  }, [modal]);

  return (
    <>
      {!member ? (
        <div className="text-center">회원 정보를 불러오는 중입니다...</div>
      ) : (
        <div className="container">
          <div
            className={`d-flex ${
              windowWidth < 768
                ? "flex-column align-items-center"
                : "justify-content-center"
            }`}
            style={{ gap: "48px" }}
          >
            <img
              className="shadow"
              style={{
                borderRadius: "999px",
                width: "200px",
                height: "200px",
                objectFit: "cover",
              }}
              src={`http://localhost:8080/api/member/image/${member.memberNo}`}
            />

            <div className="d-flex flex-column justify-content-between">
              <div>
                <div
                  className="d-flex align-items-center mb-3"
                  style={{ gap: "12px" }}
                >
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#111111",
                    }}
                  >
                    {member.memberNickname}
                  </span>
                  <span
                    style={{
                      paddingLeft: "12px",
                      paddingRight: "12px",
                      paddingTop: "7px",
                      paddingBottom: "7px",
                      border: "1px solid #F9B4ED",
                      borderRadius: "8px",
                    }}
                  >
                    {member.memberMbti}
                  </span>
                  <button
                    className="btn btn-primary"
                    style={{ borderRadius: "8px" }}
                    onClick={() => navigate("/crew/create")}
                  >
                    모임 개설
                  </button>
                  <button
                    className="btn bg-transparent p-0"
                    style={{ border: "none" }}
                    onClick={openModal}
                  >
                    <FaCog size={18} color="#6C757D" />
                  </button>
                </div>
                <div
                  className="d-flex align-items-center gap-1 fs-6"
                  style={{ color: "#666666" }}
                >
                  <div>{member.memberGender === "m" ? "남자" : "여자"}</div>
                  <span>·</span>
                  <div>{member.memberLocation}</div>
                  <span>·</span>
                  <div>{member.memberSchool}</div>
                  <span>·</span>
                  <div>{member.memberBirth}</div>
                </div>
              </div>
              <div
                className={`d-flex flex-wrap ${windowWidth < 768 && "mt-4"}`}
                style={{ gap: "12px", width: "360px" }}
              >
                {member.memberLike.map((like, idx) => (
                  <span key={idx} className="mbti-badge">
                    {like}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="modal fade" ref={modal} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body d-flex flex-column p-0">
                  <button
                    className="btn text-white"
                    style={{
                      backgroundColor: "#333333",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                      borderBottomLeftRadius: "0px",
                      borderBottomRightRadius: "0px",
                      borderBottom: "1px solid #EBEBEB",
                    }}
                    onClick={() => {
                      closeModal();
                      navigate("/mypage/edit");
                    }}
                  >
                    개인정보변경
                  </button>
                  <button
                    className="btn text-white"
                    style={{
                      backgroundColor: "#333333",
                      borderRadius: "0px",
                      border: "0",
                    }}
                    onClick={async () => {
                      const choice =
                        window.confirm("정말 로그아웃 하시겠습니까?");
                      if (!choice) {
                        return;
                      }

                      let accessToken = localStorage.getItem("accessToken");
                      try {
                        axios.defaults.headers.common[
                          "Authorization"
                        ] = `Bearer ${accessToken}`;

                        await axios.post(
                          "http://localhost:8080/api/member/signout"
                        );
                      } catch (e) {
                      } finally {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        closeModal();
                        navigate("/");
                        window.location.reload();
                      }
                    }}
                  >
                    로그아웃
                  </button>
                  <button
                    className="btn text-danger"
                    style={{
                      backgroundColor: "#333333",
                      borderTopLeftRadius: "0px",
                      borderTopRightRadius: "0px",
                      borderBottomLeftRadius: "8px",
                      borderBottomRightRadius: "8px",
                      borderTop: "1px solid #EBEBEB",
                    }}
                    onClick={() => {
                      closeModal();
                      navigate("/mypage/exit");
                    }}
                  >
                    회원탈퇴
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
