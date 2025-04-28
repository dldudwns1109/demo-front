import { Route, Routes } from "react-router-dom";

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
import GroupCreate from "./pages/GroupCreate";
import GroupCreateFinish from "./pages/GroupCreateFinish";
import Chat from "./pages/Chat";
import JoinBoard from "./pages/JoinBoard";
import JoinBoardDetail from "./pages/JoinBoardDetail";
import JoinBoardWrite from "./pages/JoinBoardWrite";
import JoinBoardEdit from "./pages/JoinBoardEdit";
import GroupList from "./pages/GroupList";
import GroupDetail from "./pages/GroupDetail";
import GroupEdit from "./pages/GroupEdit";
import GroupDelete from "./pages/GroupDelete";
import GroupDeleteFinish from "./pages/GroupDeleteFinish";
import GroupBoard from "./pages/GroupBoard";
import GroupBoardDetail from "./pages/GroupBoardDetail";
import GroupBoardWrite from "./pages/GroupBoardWrite";
import GroupBoardEdit from "./pages/GroupBoardEdit";
import GroupChat from "./pages/GroupChat";
import MeetingCreate from "./pages/MeetingCreate";
import MeetingDetail from "./pages/MeetingDetail";
import MeetingEdit from "./pages/MeetingEdit";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-finish" element={<SignupFinish />} />
        <Route path="/find-id" element={<FindId />} />
        <Route path="/find-password" element={<FindPassword />} />
        <Route path="/mypage/:memberId" element={<Mypage />} />
        <Route path="/mypage/edit" element={<MyPageEdit />} />
        <Route path="/mypage/edit/password" element={<MypageEditPassword />} />
        <Route path="/mypage/exit" element={<MyPageExit />} />
        <Route path="/mypage/exit-finish" element={<MyPageExitFinish />} />
        <Route path="/group/create" element={<GroupCreate />} />
        <Route path="/group/create-finish" element={<GroupCreateFinish />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/join/board" element={<JoinBoard />} />
        <Route path="/join/board/detail/:boardNo" element={<JoinBoardDetail />} />
        <Route path="/join/board/write" element={<JoinBoardWrite />} />
        <Route path="/join/board/edit" element={<JoinBoardEdit />} />
        <Route path="/group/list" element={<GroupList />} />
        <Route path="/group/detail" element={<GroupDetail />} />
        <Route path="/group/edit" element={<GroupEdit />} />
        <Route path="/group/delete" element={<GroupDelete />} />
        <Route path="/group/delete-finish" element={<GroupDeleteFinish />} />
        <Route path="/group/board" element={<GroupBoard />} />
        <Route path="/group/board/detail" element={<GroupBoardDetail />} />
        <Route path="/group/board/write" element={<GroupBoardWrite />} />
        <Route path="/group/board/edit" element={<GroupBoardEdit />} />
        <Route path="/group/chat" element={<GroupChat />} />
        <Route path="/meeting/create" element={<MeetingCreate />} />
        <Route path="/meeting/detail" element={<MeetingDetail />} />
        <Route path="/meeting/edit" element={<MeetingEdit />} />
      </Routes>
    </>
  );
}

export default App;
