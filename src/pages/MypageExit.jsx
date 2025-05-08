import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { loginState, userNoState } from "../utils/storage";
import Header from "../components/Header";
import Unauthorized from "../components/Unauthorized";

export default function MypageExit() {
  const userNo = useRecoilValue(userNoState);
  const login = useRecoilValue(loginState);
  const [checkAgree, setCheckAgree] = useState(false);
  const [password, setPassowrd] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [blurMessage, setBlurMessage] = useState("");

  const navigate = useNavigate();

  const checkPassword = async () => {
    if (userNo) {
      const res = await axios.post(
        "http://localhost:8080/api/member/checkPassword",
        {
          memberNo: userNo,
          memberPw: password,
        }
      );
      return res.data;
    }
  };

  useEffect(() => {
    setIsValid(checkPassword() && checkAgree);
  }, [userNo, checkAgree, password]);

  return (
    <div className="vh-100">
      <Header input={false} loginState={`${login ? "loggined" : "login"}`} />

      {login ? (
        <div className="d-flex justify-content-center">
          <div
            className="d-flex flex-column align-items-center"
            style={{ paddingTop: "70px", width: "360px" }}
          >
            <span
              className="text-danger fw-bold"
              style={{
                fontSize: "32px",
                marginTop: "80px",
                marginBottom: "24px",
              }}
            >
              회원 탈퇴
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
              <span>
                탈퇴가 완료되면, 회원님의 모든 개인정보와 서비스 이용 기록은
                영구적으로 삭제되며, 이후에는{" "}
                <span className="text-danger">
                  어떤 방식으로도 복구가 불가능합니다.
                </span>
              </span>
              <span>
                이는 개인정보 보호를 위한 조치이며, 탈퇴 후에는 이전에 이용하신{" "}
                <span className="text-danger">
                  혜택, 저장된 데이터, 활동 이력 또한 모두 사라지게 됩니다.
                </span>
              </span>
              <span>
                탈퇴가 완료된 이후에는 동일한 계정으로{" "}
                <span className="text-danger">
                  재가입이 불가능할 수 있으며, 일부 서비스는 일정 기간 동안
                  재사용이 제한될 수 있습니다.
                </span>
              </span>
              <span>
                진행 전, 필요한 데이터가 있다면 반드시 미리 백업해 주세요. 계정
                탈퇴는 되돌릴 수 없는 작업이므로 신중하게 결정해 주시기
                바랍니다.
              </span>
            </div>

            <div
              className="d-flex align-items-center"
              style={{ width: "360px", marginBottom: "24px" }}
            >
              <input
                type="checkbox"
                id="agreeInput"
                style={{ width: "20px", height: "20px" }}
                value={checkAgree}
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

            <div style={{ margin: "0 auto", marginBottom: "48px" }}>
              <label className="label-text">비밀번호 입력</label>

              <input
                type="password"
                placeholder="사용중이신 비밀번호를 입력해주세요."
                className="member-input"
                style={{ outline: "none" }}
                value={password}
                onChange={(e) => setPassowrd(e.target.value)}
                onBlur={async () =>
                  !(await checkPassword())
                    ? setBlurMessage("입력하신 비밀번호가 일치하지 않습니다.")
                    : setBlurMessage("")
                }
              />
              <div className="text-danger" style={{ fontSize: "14px" }}>
                {blurMessage}
              </div>
            </div>

            <button
              className="btn btn-danger w-100"
              onClick={async () => {
                try {
                  await axios.delete(
                    `http://localhost:8080/api/member/${userNo}`
                  );
                } catch (e) {
                } finally {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  navigate("/mypage/exit-finish", {
                    state: { isFinish: true },
                  });
                }
              }}
              disabled={!isValid}
            >
              회원 탈퇴하기
            </button>
          </div>
        </div>
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}
