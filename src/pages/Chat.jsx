import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useRecoilValue } from "recoil";
import { loginState, userNoState } from "../utils/storage";
import axios from "axios";
import moment from "moment";
import "moment/locale/ko";
import Header from "../components/Header";
import Unauthorized from "../components/Unauthorized";

import { FaRegPaperPlane } from "react-icons/fa6";

export default function Chat() {
  const userNo = useRecoilValue(userNoState);
  const login = useRecoilValue(loginState);
  const [client, setClient] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatRoom, setChatRoom] = useState([]);
  const [currRoom, setCurrRoom] = useState(null);
  const [subscription, setSubscription] = useState(null); // 구독 상태 추가

  const scrollContainerRef = useRef(null);

  const accessToken = axios.defaults.headers.common["Authorization"];

  useEffect(() => {
    if (!userNo) return;

    const fetchData = async () => {
      const res = await axios.get(
        `http://localhost:8080/api/chat/list/${userNo}`
      );
      setChatRoom(res.data);
    };

    fetchData();
  }, [userNo]);

  useEffect(() => {
    if (chatRoom.length) setCurrRoom(chatRoom[0].roomNo);
  }, [chatRoom]);

  useEffect(() => {
    if (!login) return;

    if (currRoom) {
      const client = connectToServer();
      setClient(client);
    }

    return () => {
      disconnectFromServer(client);
      setClient(null);
    };
  }, [login, currRoom]);

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
      connectHeaders: {
        accessToken,
      },
      onConnect: () => {
        if (subscription) {
          subscription.unsubscribe();
          setSubscription(null);
        }

        const newSubscription = client.subscribe(
          `/private/member/chat/${currRoom}`,
          (message) => {
            const json = JSON.parse(message.body);
            json.type = "CHAT";
            setMessages((prev) => [...prev, json]);
          }
        );

        setSubscription(newSubscription);
      },
      onDisconnect: () => {},
      // debug: (str) => console.log(str),
    });

    client.activate();

    return client;
  }, [currRoom, subscription]);

  const disconnectFromServer = useCallback(
    (client) => {
      if (subscription) {
        subscription.unsubscribe();
        setSubscription(null);
      }
      if (client) client.deactivate();
    },
    [subscription]
  );

  const sendMessageToServer = useCallback(() => {
    if (
      client === null ||
      !client.connected ||
      !client.active ||
      !input.trim() ||
      !login
    )
      return;

    const stompMessage = {
      destination: "/app/member/chat",
      headers: { accessToken },
      body: JSON.stringify({ target: currRoom, content: input }),
    };

    client.publish(stompMessage);
    setInput("");
  }, [client, input, login, currRoom]);

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
        <div className="d-flex" style={{ paddingTop: "70px" }}>
          <div
            style={{
              padding: "32px",
              backgroundColor: "#FAFAFA",
              width: "460px",
              height: "calc(100vh - 70px)",
            }}
          >
            {chatRoom.map((room, idx) => (
              <button
                key={idx}
                className="w-100 btn d-flex justify-content-between align-items-center p-3"
                style={{
                  backgroundColor:
                    room.roomNo === currRoom ? "#EBEBEB" : "transparent",
                }}
                onClick={() => setCurrRoom(room.roomNo)}
              >
                <div className="d-flex gap-3">
                  <img
                    className="shadow-sm"
                    style={{ borderRadius: "999px" }}
                    src={`http://localhost:8080/api/member/image/${room.accountNo}`}
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
                    <span style={{ fontSize: "14px", color: "#333333" }}>
                      {room.content}
                    </span>
                  </div>
                </div>
                {moment(room.time).format("a H:mm")}
              </button>
            ))}
          </div>
          <div className="mx-auto" style={{ width: "53%" }}>
            <div
              ref={scrollContainerRef}
              className="d-flex flex-column gap-2 overflow-auto p-4"
              style={{ height: "80vh" }}
            >
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`d-flex ${
                    message.accountNo === userNo && "justify-content-end"
                  } align-items-end`}
                  style={{ gap: "12px" }}
                >
                  {message.accountNo === userNo ? (
                    <>
                      {isLastMessage(message, idx) && (
                        <span style={{ fontSize: "14px", color: "#333333" }}>
                          {moment(message.time).format("a H:mm")}
                        </span>
                      )}
                      <div>
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
                    </>
                  ) : (
                    <>
                      {isSenderVisible(message, idx) && (
                        <img
                          className="shadow-sm"
                          style={{ objectFit: "cover", borderRadius: "999px" }}
                          src={`http://localhost:8080/api/member/image/${message.accountNo}`}
                          width={60}
                          height={60}
                        />
                      )}
                      <div
                        style={{
                          paddingLeft: !isSenderVisible(message, idx)
                            ? "72px"
                            : "0px",
                        }}
                      >
                        {isSenderVisible(message, idx) && (
                          <span style={{ fontSize: "14px", color: "#111111" }}>
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
                      {isLastMessage(message, idx) && (
                        <span style={{ fontSize: "14px", color: "#333333" }}>
                          {moment(message.time).format("a H:mm")}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div
              className="d-flex justify-content-between position-absolute"
              style={{
                width: "53%",
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
                  if (e.key === "Enter") sendMessageToServer();
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
        </div>
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}
