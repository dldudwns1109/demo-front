import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useRecoilValue } from "recoil";
import { loginState, userNoState, windowWidthState } from "../utils/storage";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ko";
import { toast, ToastContainer } from "react-toastify";
import Header from "../components/Header";
import Unauthorized from "../components/Unauthorized";

import { FaRegPaperPlane } from "react-icons/fa6";

moment.locale("ko");

export default function Chat() {
  const windowWidth = useRecoilValue(windowWidthState);
  const userNo = useRecoilValue(userNoState);
  const login = useRecoilValue(loginState);
  const [client, setClient] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatRoom, setChatRoom] = useState([]);
  const [currRoom, setCurrRoom] = useState(null);

  const scrollContainerRef = useRef(null);

  const accessToken = axios.defaults.headers.common["Authorization"];

  const errorToastify = (message) => toast.error(message);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `/chat/messages/${currRoom}`
      );
      setMessages(res.data);
    };
    if (currRoom) fetchData();

    if (!isConnected || !client?.active || !currRoom) return;

    client.publish({
      destination: "/app/member/read",
      headers: { accessToken },
      body: JSON.stringify({ target: currRoom, content: "" }),
    });
  }, [currRoom, isConnected]);

  useEffect(() => {
    if (!login) return;
    setCurrRoom(chatRoom[0]?.roomNo);
  }, [login, chatRoom.length]);

  useEffect(() => {
    if (!login) return;

    const client = connectToServer();
    setClient(client);

    return () => {
      disconnectFromServer(client);
      setClient(null);
    };
  }, [login, chatRoom.length, currRoom]);

  useEffect(() => {
    if (!isConnected || !client?.active) return;

    client.publish({
      destination: "/app/member/room",
      headers: { accessToken },
    });
  }, [isConnected, receivedMessage]);

  useEffect(() => {
    if (!isConnected || !client?.active || !currRoom) return;

    if (
      receivedMessage?.targetNo === currRoom &&
      receivedMessage?.accountNo !== userNo
    ) {
      client.publish({
        destination: "/app/member/read",
        headers: { accessToken },
        body: JSON.stringify({ target: currRoom, content: "" }),
      });
    }
  }, [receivedMessage, currRoom, isConnected]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    console.log(chatRoom);
  }, [chatRoom]);

  const connectToServer = useCallback(() => {
    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: async () => {
        client.subscribe(`/private/member/rooms/${userNo}`, (message) => {
          setChatRoom(JSON.parse(message.body));
        });

        chatRoom?.forEach((room) => {
          client.subscribe(`/private/member/read/${room.roomNo}`, (message) => {
            setMessages(JSON.parse(message.body));
          });

          client.subscribe(`/private/member/chat/${room.roomNo}`, (message) => {
            setReceivedMessage({
              ...JSON.parse(message.body),
              type: "CHAT",
            });
            if (room.roomNo === currRoom) {
              setMessages((messages) => [
                ...messages,
                {
                  ...JSON.parse(message.body),
                  type: "CHAT",
                },
              ]);
            }
          });
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
  }, [login, userNo, chatRoom, currRoom]);

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
      body: JSON.stringify({ target: currRoom, content: input }),
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
      <Header loginState={`${login ? "loggined" : "login"}`} input={false} />

      {login ? (
        chatRoom.length ? (
          <div
            className={`d-flex ${windowWidth <= 1024 && "flex-column"}`}
            style={{ paddingTop: "70px" }}
          >
            {windowWidth > 1024 ? (
              <div
                style={{
                  padding: "32px",
                  backgroundColor: "#FAFAFA",
                  width: "380px",
                  height: "calc(100vh - 70px)",
                }}
              >
                {chatRoom.map((room, idx) => (
                  <button
                    key={idx}
                    className="w-100 btn d-flex justify-content-between align-items-center p-3 position-relative"
                    style={{
                      backgroundColor:
                        room.roomNo === currRoom ? "#EBEBEB" : "transparent",
                    }}
                    onClick={() => setCurrRoom(room.roomNo)}
                  >
                    <div className="d-flex gap-3">
                      <img
                        className="shadow-sm"
                        style={{ borderRadius: "999px", objectFit: "cover" }}
                        src={`/member/image/${room.accountNo}`}
                        width={64}
                        height={64}
                      />
                      <div
                        className="d-flex flex-column align-items-start"
                        style={{ gap: "12px" }}
                      >
                        <span style={{ color: "#111111" }}>
                          {room.accountNickname}
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#333333",
                            textAlign: "left",
                          }}
                        >
                          {room.content.length > 16
                            ? room.content.slice(0, 16) + "..."
                            : room.content}
                        </span>
                      </div>
                    </div>
                    <div style={{ minWidth: "80px" }}>
                      {moment(room.time).format("a h:mm")}
                    </div>
                    {room.chatRead !== 0 && (
                      <span
                        className="position-absolute px-2 text-white"
                        style={{
                          fontSize: "16px",
                          backgroundColor: "#F9B4ED",
                          right: "-8px",
                          top: "-8px",
                          borderRadius: "999px",
                        }}
                      >
                        {room.chatRead}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div
                className="d-flex"
                style={{
                  padding: "16px",
                  backgroundColor: "#FAFAFA",
                }}
              >
                {chatRoom.map((room, idx) => (
                  <button
                    key={idx}
                    className="btn d-flex flex-column justify-content-between align-items-center p-2 gap-2"
                    style={{
                      width: "98px",
                      backgroundColor:
                        room.roomNo === currRoom ? "#EBEBEB" : "transparent",
                    }}
                    onClick={() => setCurrRoom(room.roomNo)}
                  >
                    <img
                      className="shadow-sm"
                      style={{ borderRadius: "999px", objectFit: "cover" }}
                      src={`/member/image/${room.accountNo}`}
                      width={48}
                      height={48}
                    />
                    <span style={{ color: "#111111" }}>
                      {room.accountNickname.length > 4
                        ? room.accountNickname.slice(0, 4) + "..."
                        : room.accountNickname}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div
              className="mx-auto"
              style={{ width: windowWidth > 1024 ? "53%" : "80%" }}
            >
              <div
                ref={scrollContainerRef}
                className={`d-flex flex-column gap-2 overflow-auto ${
                  windowWidth > 1024 ? "p-4" : "my-4"
                }`}
                style={{ height: windowWidth > 1024 ? "76vh" : "60vh" }}
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
                            <span
                              style={{ fontSize: "14px", color: "#F9B4ED" }}
                            >
                              {message.chatRead}
                            </span>
                          )}
                          {isLastMessage(message, idx) && (
                            <span
                              style={{ fontSize: "14px", color: "#333333" }}
                            >
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
                      ) : (
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
                                src={`/member/image/${message.accountNo}`}
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
                          {/* {message.chatRead !== 0 && (
                          <span>{message.chatRead}</span>
                        )} */}
                          {isLastMessage(message, idx) && (
                            <span
                              style={{ fontSize: "14px", color: "#333333" }}
                            >
                              {moment(message.time).format("a h:mm")}
                            </span>
                          )}
                        </>
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
          <div
            className="d-flex flex-column justify-content-center align-items-center gap-4"
            style={{ paddingTop: "70px" }}
          >
            <img
              src="/images/no-authorized.svg"
              style={{ marginTop: "80px" }}
            />
            <span className="fs-6 fw-bold" style={{ color: "#333333" }}>
              채팅 목록이 없습니다.
            </span>
          </div>
        )
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}
