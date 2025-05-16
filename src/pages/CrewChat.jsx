import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  loginState,
  locationState,
  categoryState,
  windowWidthState,
  userNoState,
} from "../utils/storage";
import moment from "moment";
import "moment/dist/locale/ko";
import { toast, ToastContainer } from "react-toastify";
import Header from "../components/Header";
import CrewTopNav from "../components/CrewTopNav";
import Unauthorized from "../components/Unauthorized";

import { FaRegPaperPlane } from "react-icons/fa6";

export default function CrewChat() {
  const { crewNo } = useParams();
  const [crewName, setCrewName] = useState("");

  const login = useRecoilValue(loginState);
  const [location, setLocation] = useRecoilState(locationState);
  const [category, setCategory] = useRecoilState(categoryState);
  const windowWidth = useRecoilValue(windowWidthState);
  const userNo = useRecoilValue(userNoState);
  const [client, setClient] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currRoom, setCurrRoom] = useState(null);
  const [isCrewMember, setIsCrewMember] = useState(null);

  const scrollContainerRef = useRef(null);

  const accessToken = axios.defaults.headers.common["Authorization"];

  const errorToastify = (message) => toast.error(message);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `http://localhost:8080/api/chat/crew/${crewNo}`
      );
      setCurrRoom(res.data);
    };
    const checkCrewMember = async () => {
      const res = await axios.get(
        `http://localhost:8080/api/crewmember/${crewNo}/member`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      setIsCrewMember(res.data);
    };
    if (crewNo && login) {
      checkCrewMember();
      fetchData();
    }
  }, [crewNo, login]);

  useEffect(() => {
    if (isCrewMember !== null && !isCrewMember) {
      console.log(isCrewMember);
    }
  }, [isCrewMember]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `http://localhost:8080/api/chat/messages/${currRoom}`
      );
      setMessages(res.data);
    };
    if (currRoom) fetchData();

    if (!isConnected || !client?.active || !currRoom) return;

    console.log("메세지 확인");
    client.publish({
      destination: "/app/member/read",
      headers: { accessToken },
      body: JSON.stringify({ target: currRoom, content: "", crewNo: crewNo }),
    });
  }, [currRoom, receivedMessage, isConnected]);

  useEffect(() => {
    if (!login) return;

    const client = connectToServer();
    setClient(client);

    return () => {
      disconnectFromServer(client);
      setClient(null);
    };
  }, [login, currRoom]);

  useEffect(() => {
    if (!isConnected || !client?.active || !currRoom) return;

    if (
      receivedMessage?.targetNo === currRoom &&
      receivedMessage?.accountNo !== userNo
    ) {
      client.publish({
        destination: "/app/member/read",
        headers: { accessToken },
        body: JSON.stringify({ target: currRoom, content: "", crewNo: crewNo }),
      });
    }
  }, [receivedMessage, currRoom, isConnected]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const connectToServer = useCallback(() => {
    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: async () => {
        client.subscribe(`/private/member/read/${currRoom}`, (message) => {
          setMessages(JSON.parse(message.body));
        });

        client.subscribe(`/private/member/chat/${currRoom}`, (message) => {
          setReceivedMessage({
            ...JSON.parse(message.body),
            type: "CREW",
          });
          setMessages((messages) => [
            ...messages,
            {
              ...JSON.parse(message.body),
              type: "CREW",
            },
          ]);
        });

        setIsConnected(true);
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      // debug: (str) => console.log(str),
    });

    if (login) client.connectHeaders = { accessToken };

    client.activate();

    return client;
  }, [login, userNo, currRoom]);

  const disconnectFromServer = useCallback((client) => {
    if (client) client.deactivate();
    setClient(false);
    setIsConnected(false);
  }, []);

  const sendMessageToServer = useCallback(() => {
    if (
      client === null ||
      !client.connected ||
      !client.active ||
      !input.trim() ||
      !login
    )
      return;

    client.publish({
      destination: "/app/member/chat",
      headers: { accessToken },
      body: JSON.stringify({
        target: currRoom,
        content: input,
        crewNo: crewNo,
      }),
    });
    setInput("");
  }, [client, input, login, currRoom]);

  const isDayFirstMessage = useCallback(
    (message, idx) => {
      if (!idx) return true;

      const prevMessage = messages[idx - 1];
      return moment(message.time).isAfter(moment(prevMessage.time), "day");
    },
    [messages]
  );

  const isLastMessage = useCallback(
    (message, idx) => {
      if (idx + 1 === messages.length) return true;

      const nextMessage = messages[idx + 1];
      if (message.accountNo !== nextMessage.accountNo) return true;

      return (
        moment(message.time).format("YYYY-MM-DD h:mm") !==
        moment(nextMessage.time).format("YYYY-MM-DD h:mm")
      );
    },
    [messages]
  );

  const isSenderVisible = useCallback(
    (message, idx) => {
      if (userNo === message.accountNo) return false;
      if (!idx) return true;

      const prevMessage = messages[idx - 1];
      if (message.accountNo !== prevMessage.accountNo) return true;

      return (
        moment(message.time).format("YYYY-MM-DD h:mm") !==
        moment(prevMessage.time).format("YYYY-MM-DD h:mm")
      );
    },
    [messages, userNo]
  );

  return (
    <div className="vh-100">
      <Header
        loginState={`${login ? "loggined" : "login"}`}
        category={category}
        setCategory={setCategory}
        location={location}
        setLocation={setLocation}
      />
      <div
        className="container"
        style={{ paddingTop: "5rem", paddingBottom: "2rem" }}
      >
        <CrewTopNav />

        {isCrewMember !== null && isCrewMember && login ? (
        <div className={`d-flex ${windowWidth <= 1024 && "flex-column"}`}>
          <div
            className="mx-auto"
            style={{ width: windowWidth > 1024 ? "53%" : "80%" }}
          >
            <div
              ref={scrollContainerRef}
              className={`d-flex flex-column gap-2 overflow-auto ${
                windowWidth > 1024 ? "p-4" : "my-4"
              }`}
              style={{ height: windowWidth > 1024 ? "65vh" : "60vh" }}
            >
              {messages.map((message, idx) => (
                <div key={idx} className="d-flex flex-column gap-3">
                  {isDayFirstMessage(message, idx) && (
                    <div className="d-inline-flex justify-content-center mt-3">
                      <span
                        className="px-3 py-2"
                        style={{
                          backgroundColor: "#F1F3F5",
                          borderRadius: "999px",
                          fontSize: "14px",
                          color: "#666666",
                        }}
                      >
                        {moment(message.time).format("YYYY년 MM월 DD일 dddd")}
                      </span>
                    </div>
                  )}
                  <div
                    className={`d-flex ${
                      message.accountNo === userNo && "justify-content-end"
                    } align-items-end`}
                    style={{ gap: "12px" }}
                  >
                    {message.accountNo === userNo ? (
                      <>
                        {message.chatRead !== 0 && (
                          <span style={{ fontSize: "14px", color: "#F9B4ED" }}>
                            {message.chatRead}
                          </span>
                        )}
                        {isLastMessage(message, idx) && (
                          <span style={{ fontSize: "14px", color: "#333333" }}>
                            {moment(message.time).format("a h:mm")}
                          </span>
                        )}
                        <div>
                          <div
                            className="bg-primary text-white py-2"
                            style={{
                              borderRadius: "8px",
                              paddingLeft: "12px",
                              paddingRight: "12px",
                              maxWidth: "200px",
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            <span>{message.content}</span>
                          </div>
                        </div>
                      </>
                    ) : message.accountNo !== null ? (
                      <>
                        <div className="d-flex" style={{ gap: "12px" }}>
                          {isSenderVisible(message, idx) && (
                            <img
                              className="shadow-sm"
                              style={{
                                objectFit: "cover",
                                borderRadius: "999px",
                                marginBottom:
                                  windowWidth > 1024 ? "0px" : "12px",
                              }}
                              src={`http://localhost:8080/api/member/image/${message.accountNo}`}
                              width={windowWidth > 1024 ? 64 : 48}
                              height={windowWidth > 1024 ? 64 : 48}
                            />
                          )}
                          <div
                            style={{
                              paddingLeft: !isSenderVisible(message, idx)
                                ? windowWidth > 1024
                                  ? "76px"
                                  : "60px"
                                : "0px",
                            }}
                          >
                            {isSenderVisible(message, idx) && (
                              <span
                                style={{ fontSize: "14px", color: "#111111" }}
                              >
                                {message.accountNickname}
                              </span>
                            )}
                            <div
                              className="py-2"
                              style={{
                                backgroundColor: "#F1F3F5",
                                borderRadius: "8px",
                                paddingLeft: "12px",
                                paddingRight: "12px",
                                maxWidth: "200px",
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              <span style={{ color: "#333333" }}>
                                {message.content}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isLastMessage(message, idx) && (
                          <span style={{ fontSize: "14px", color: "#333333" }}>
                            {moment(message.time).format("a h:mm")}
                          </span>
                        )}
                        {message.chatRead !== 0 && (
                          <span style={{ fontSize: "14px", color: "#F9B4ED" }}>
                            {message.chatRead}
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="d-inline-flex justify-content-center w-100">
                        <span
                          className="px-3 py-2"
                          style={{
                            backgroundColor: "#F1F3F5",
                            borderRadius: "999px",
                            fontSize: "14px",
                            color: "#666666",
                          }}
                        >
                          {message.content}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="d-flex justify-content-between position-absolute"
              style={{
                width: windowWidth > 1024 ? "53%" : "80%",
                backgroundColor: "#F1F3F5",
                borderRadius: "8px",
                bottom: "80px",
              }}
            >
              <input
                type="text"
                className="border-0 w-100"
                style={{
                  backgroundColor: "#F1F3F5",
                  paddingLeft: "12px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  borderRadius: "8px",
                  outline: "none",
                }}
                placeholder="메세지 입력..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    e.target.value.length > 200
                      ? errorToastify("200글자 이상 입력할 수 없습니다!")
                      : sendMessageToServer();
                  }
                }}
              />
              <button
                className="btn py-0 pb-1"
                style={{ height: "40px" }}
                onClick={sendMessageToServer}
              >
                <FaRegPaperPlane size={18} color="#6C757D" />
              </button>
            </div>
          </div>
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            pauseOnHover={false}
            theme="light"
            limit={1}
          />
        </div>
      ) : (
        <Unauthorized />
      )}
      </div>

      
    </div>
  );
}
