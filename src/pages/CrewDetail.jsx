import { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { loginState, locationState } from "../utils/storage";
import Header from "../components/Header";
import CrewTopNav from "../components/CrewTopNav";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CrewDetail() {
  const login = useRecoilValue(loginState);
  const [location, setLocation] = useRecoilState(locationState);
  const { crewNo } = useParams();
  const [crewName, setCrewName] = useState("");

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/crew/${crewNo}`);
        setCrewName(res.data.crewName);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCrew();
  }, [crewNo]);

  return (
    <>
      <Header
        loginState={`${login ? "loggined" : "login"}`}
        location={location}
        setLocation={setLocation}
      />
      <div className="container" style={{ paddingTop: "5rem", paddingBottom: "2rem" }}>
        <CrewTopNav />

        <div className="text-center text-muted mt-5">
          <p style={{ fontSize: "1.1rem" }}>아직 모임 상세 페이지 구현 X</p>
        </div>
      </div>
    </>
  );
}
