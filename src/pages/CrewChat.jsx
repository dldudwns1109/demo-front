import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import { loginState, locationState, categoryState } from "../utils/storage";
import Header from "../components/Header";
import CrewTopNav from "../components/CrewTopNav";

export default function CrewChat() {
  const { crewNo } = useParams();
  const [crewName, setCrewName] = useState("");

  const login = useRecoilValue(loginState);
  const [location, setLocation] = useRecoilState(locationState);
  const [category, setCategory] = useRecoilState(categoryState);

  useEffect(() => {
    const fetchCrewName = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/crew/${crewNo}`);
        setCrewName(res.data.crewName);
      } catch (err) {
        console.error("크루 이름 불러오기 실패", err);
      }
    };
    fetchCrewName();
  }, [crewNo]);

  return (
    <>
      <Header
        loginState={`${login ? "loggined" : "login"}`}
        category={category}
        setCategory={setCategory}
        location={location}
        setLocation={setLocation}
      />

      <div style={{ paddingTop: "5rem", paddingBottom: "2rem" }}>
        <CrewTopNav />

        <div className="text-center text-muted mt-5">
          <p style={{ fontSize: "1.1rem" }}>아직 채팅 기능이 구현 X</p>
        </div>
      </div>
    </>
  );
}
