import "../css/Mypage.css";
import Header from "../components/Header";

const locationList = ["김포시", "서울시", "대전시"];
const schollList = ["가톨릭대학교", "고려대학교", "연세대학교"];
export default function MypageEdit() {
  return (
    <>
      {/* 헤더 */}
      <Header/>
      {/* 수정 페이지 */}
      <div className="row">
        <div className="col text-center">
          <span style={{ fontSize: "24px", fontWeight: "bold", color: "#111111" }}>
            개인정보수정
          </span>
          <div className="profile-left mt-4">
            <img className="memberProfile" />
          </div>
          <div className="row mt-4">
            <label className="col-sm-3 col-form-label">아이디</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" name="memberId"></input>
            </div>
          </div>
          <div className="row mt-4">
          <label className="col-sm-3 col-form-label">닉네임</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" name="memberNickname"></input>
            </div>
          </div>
          <div className="row mt-4">
          <label className="col-sm-3 col-form-label">비밀번호</label>
            <div className="col-sm-9">
              <button type="button"className="btn btn-secondary w-100" name="memberPw">비밀번호 변경하기</button>
            </div>
          </div>
          <div className="row mt-4">
          <label className="col-sm-3 col-form-label">이메일</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" name="memberEmail"></input>
            </div>
          </div>
          <div className="row mt-4">
          <label className="col-sm-3 col-form-label">생년월일</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" name="memberBirth"></input>
            </div>
          </div>
          <div className="row mt-4">
            <label className="col-sm-3 col-form-label">성별</label>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="memberGender"></input>
            </div>
          </div>
          <div className="row mt-4">
            <label className="col-sm-3 col-form-label">거주지</label>
            <div className="col-sm-9">
              <select className="form-control" name="memberLocation">
                <option value="">선택하세요</option>
                  {locationList.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row mt-4">
            <label className="col-sm-3 col-form-label">재학중인 학교</label>
            <div className="col-sm-9">
              <select className="form-control" name="memberSchool">
                <option value="">선택하세요</option>
                  {schollList.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row mt-4">
          <label className="col-sm-3 col-form-label">관심사</label>
            <div className="col-sm-9">
              <button type="button"className="mbti-badge" name="memberLike">스포츠</button>
              <button type="button"className="mbti-badge" name="memberLike">스포츠</button>
              <button type="button"className="mbti-badge" name="memberLike">스포츠</button>
              <button type="button"className="mbti-badge" name="memberLike">스포츠</button>
            </div>
          </div>
          <div className="row mt-4">
          <label className="col-sm-3 col-form-label">MBTI</label>
            <div className="col-sm-9">
              <button type="button"className="mbti-badge" name="memberMbti">ISFJ</button>
              <button type="button"className="mbti-badge" name="memberMbti">ISFJ</button>
              <button type="button"className="mbti-badge" name="memberMbti">ISFJ</button>
              <button type="button"className="mbti-badge" name="memberMbti">ISFJ</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
