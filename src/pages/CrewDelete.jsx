import { useEffect, useState } from "react";
import Header from "../components/Header";
import { loginState, userNoState, windowWidthState } from "../utils/storage";
import { useRecoilValue } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import Unauthorized from "../components/Unauthorized";
import axios from "axios";

export default function CrewDelete() {
  const windowWidth = useRecoilValue(windowWidthState);
  const userNo = useRecoilValue(userNoState);
  const { crewNo } = useParams();
  const login = useRecoilValue(loginState);
  const [checkAgree, setCheckAgree] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const navigate = useNavigate();

  // Authorization 헤더 설정 함수
  const getAuthHeaders = () => {
    const token = localStorage.getItem("refreshToken");
    return token ? { Authorization: `Bearer ${token.trim()}` } : {};
  };

  // 모임장 여부 확인
  useEffect(() => {
    const checkLeaderStatus = async () => {
      try {
        const headers = getAuthHeaders();
        const res = await axios.get(
          `http://localhost:8080/api/crewmember/${crewNo}/leader`,
          { headers }
        );
        setIsLeader(res.data);
      } catch (err) {
        console.error("Error checking leader status:", err.message);
      }
    };

    if (login) {
      checkLeaderStatus();
    }
  }, [crewNo, login]);

  // 모임 해체 처리
  const handleDeleteCrew = async () => {
    try {
      const headers = getAuthHeaders();
      await axios.delete(`http://localhost:8080/api/crew/${crewNo}`, {
        headers,
      });

      // 모임 해체 완료 페이지로 이동
      navigate(`/crew/${crewNo}/delete-finish`, {
        state: { isFinish: true },
      });
      window.location.reload();
    } catch (err) {
      console.error("Error deleting crew:", err.message);
      window.confirm("모임 해체에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="vh-100">
        <Header input={false} loginState={`${login ? "loggined" : "login"}`} />
        {login ? (
          isLeader ? (
            <div className="d-flex justify-content-center">
              <div
                className="d-flex flex-column align-items-center"
                style={{
                  paddingTop: "70px",
                  paddingBottom: windowWidth > 768 ? "0px" : "80px",
                  width: windowWidth > 768 ? "360px" : "300px",
                }}
              >
                <span
                  className="text-danger fw-bold"
                  style={{
                    fontSize: "32px",
                    marginTop: "80px",
                    marginBottom: "24px",
                  }}
                >
                  모임 해체
                </span>

                <div
                  className="d-flex flex-column p-3 mb-3"
                  style={{
                    border: "1px solid #EBEBEB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#666666",
                    backgroundColor: "transparent",
                    gap: "12px",
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "#F52A2A" }}>
                    ⚠️ 모임 해체 전, 꼭 확인해 주세요.
                  </span>
                  <span>
                    모임 해체는{" "}
                    <span className="text-danger fw-bold">
                      되돌릴 수 없는 영구적인 조치
                    </span>
                    입니다.
                  </span>
                  <span>
                    해체를 진행하실 경우, 해당 모임과 관련된{" "}
                    <span className="text-danger fw-bold">
                      모든 정보는 즉시 삭제
                    </span>
                    되며, 이후에는{" "}
                    <span className="text-danger fw-bold">
                      어떠한 방식으로도 복구가 불가능합니다.
                    </span>
                  </span>
                  <span>
                    삭제되는 정보에는 모임에 등록된{" "}
                    <strong>
                      게시글, 일정, 공지사항, 채팅 기록, 업로드된 파일, 댓글
                    </strong>{" "}
                    등 모든 활동 내역이 포함됩니다.
                  </span>
                  <span>
                    또한, 모임 구성원들과의 연결 정보 역시 함께 사라지며, 모임
                    운영을 위해 사용된{" "}
                    <span className="text-danger fw-bold">
                      결제 내역은 환불되지 않습니다.
                    </span>
                  </span>
                  <span>
                    해체된 모임은 더 이상 검색되거나 접근할 수 없으며, 동일한
                    이름으로 다시 생성하더라도 기존의 데이터나 혜택은{" "}
                    <span className="text-danger fw-bold">
                      절대 복원되지 않습니다.
                    </span>
                  </span>
                  <span>
                    <strong>모임원들과 충분히 상의하셨나요?</strong> 본 결정은
                    모든 구성원에게 영향을 미치므로, 신중한 판단이 필요합니다.
                  </span>
                  <span>
                    진행 전, 보존하고 싶은 데이터가 있다면 반드시 별도로 백업해
                    주세요.{" "}
                    <span className="text-danger fw-bold">
                      모임 해체는 되돌릴 수 없는 작업이며, 해체 후에는 어떠한
                      수정이나 취소도 불가능합니다.
                    </span>
                  </span>
                  <span className="text-danger fw-bold">
                    정말로 이 모임을 해체하시겠습니까?
                  </span>
                </div>

                <div
                  className="d-flex align-items-center"
                  style={{
                    width: windowWidth > 768 ? "360px" : "300px",
                    marginBottom: "24px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="agreeInput"
                    style={{ width: "20px", height: "20px" }}
                    checked={checkAgree}
                    onChange={(e) => setCheckAgree(e.target.checked)}
                  />
                  <label
                    htmlFor="agreeInput"
                    style={{
                      marginLeft: "8px",
                      marginBottom: "0",
                      fontSize: "14px",
                      color: "#333333",
                    }}
                  >
                    동의합니다
                  </label>
                </div>

                <button
                  className="btn btn-danger w-100"
                  onClick={handleDeleteCrew}
                  disabled={!checkAgree}
                >
                  모임 해체하기
                </button>
              </div>
            </div>
          ) : (
            <Unauthorized />
          )
        ) : (
          <Unauthorized />
        )}
      </div>
    </>
  );
}
