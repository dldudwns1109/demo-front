import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";

import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import SignupFinish from "./pages/SignupFinish";
import FindId from "./pages/FindId";
import FindPassword from "./pages/FindPassword";
import Mypage from "./pages/Mypage";
import MyPageEdit from "./pages/MypageEdit";
import MypageEditPassword from "./pages/MypageEditPassword";
import MyPageExit from "./pages/MypageExit";
import MyPageExitFinish from "./pages/MypageExitFinish";
import CrewCreate from "./pages/CrewCreate";
import CrewCreateFinish from "./pages/CrewCreateFinish";
import Chat from "./pages/Chat";
import JoinBoard from "./pages/JoinBoard";
import JoinBoardDetail from "./pages/JoinBoardDetail";
import JoinBoardWrite from "./pages/JoinBoardWrite";
import JoinBoardEdit from "./pages/JoinBoardEdit";
import CrewList from "./pages/CrewList";
import CrewDetail from "./pages/CrewDetail";
import CrewEdit from "./pages/CrewEdit";
import CrewDelete from "./pages/CrewDelete";
import CrewDeleteFinish from "./pages/CrewDeleteFinish";
import CrewBoard from "./pages/CrewBoard";
import CrewBoardDetail from "./pages/CrewBoardDetail";
import CrewBoardWrite from "./pages/CrewBoardWrite";
import CrewBoardEdit from "./pages/CrewBoardEdit";
import CrewChat from "./pages/CrewChat";
import MeetingCreate from "./pages/MeetingCreate";
import MeetingDetail from "./pages/MeetingDetail";
import MeetingEdit from "./pages/MeetingEdit";
import { loginState, userNoState, windowWidthState } from "./utils/storage";
import "./App.css";

function App() {
  const setWindowWidth = useSetRecoilState(windowWidthState);
  const login = useRecoilValue(loginState);
  const setUserNo = useSetRecoilState(userNoState);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const refreshLogin = async () => {
      let refreshToken = localStorage.getItem("refreshToken");
      if (login || refreshToken === null) return;

      try {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${refreshToken}`;

        const res = await axios.post(
          "http://localhost:8080/api/member/refresh"
        );

        setUserNo(res.data.memberNo);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;

        localStorage.setItem("refreshToken", res.data.refreshToken);
      } catch (e) {
        console.log(e);
      }
    };

    window.addEventListener("resize", handleResize);
    refreshLogin();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-finish" element={<SignupFinish />} />
        <Route path="/find-id" element={<FindId />} />
        <Route path="/find-password" element={<FindPassword />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/mypage/edit" element={<MyPageEdit />} />
        <Route path="/mypage/edit/password" element={<MypageEditPassword />} />
        <Route path="/mypage/exit" element={<MyPageExit />} />
        <Route path="/mypage/exit-finish" element={<MyPageExitFinish />} />
        <Route path="/crew/list" element={<CrewList />} />
        <Route path="/crew/create" element={<CrewCreate />} />
        <Route path="/crew/create-finish" element={<CrewCreateFinish />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/join/board" element={<JoinBoard />} />
        <Route
          path="/join/board/detail/:boardNo"
          element={<JoinBoardDetail />}
        />
        <Route path="/join/board/write" element={<JoinBoardWrite />} />
        <Route path="/join/board/edit/:boardNo" element={<JoinBoardEdit />} />
        <Route path="/crew/:crewNo/detail" element={<CrewDetail />} />
        <Route path="/crew/:crewNo/edit" element={<CrewEdit />} />
        <Route path="/crew/:crewNo/delete" element={<CrewDelete />} />
        <Route
          path="/crew/:crewNo/delete-finish"
          element={<CrewDeleteFinish />}
        />
        {/* isCrewMember={true} CrewBoard옆에 넣을 예정 */}
        <Route path="/crew/:crewNo/board" element={<CrewBoard />} />
        <Route
          path="/crew/:crewNo/board/detail/:boardNo"
          element={<CrewBoardDetail />}
        />
        <Route path="/crew/:crewNo/board/write" element={<CrewBoardWrite />} />
        <Route
          path="/crew/:crewNo/board/edit/:boardNo"
          element={<CrewBoardEdit />}
        />
        <Route path="/crew/:crewNo/chat" element={<CrewChat />} />
        <Route path="/meeting/create" element={<MeetingCreate />} />
        <Route path="/meeting/detail" element={<MeetingDetail />} />
        <Route path="/meeting/edit" element={<MeetingEdit />} />
      </Routes>
    </>
  );
}

export default App;
