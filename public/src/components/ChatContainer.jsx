import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import axios from "axios";
import { addMsgRoute, getMsgRoute } from "../utils/APIRoutes";
import {v4 as uuidv4} from 'uuid';

function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const storedData = localStorage.getItem("chat-app-user");
        if (!storedData) {
          console.error("No user data found in localStorage!");
          return;
        }

        const data = JSON.parse(storedData);
        if (!data || !data._id || !currentChat?._id) {
          console.error("Invalid user data or currentChat!");
          return;
        }

        const response = await axios.post(getMsgRoute, {
          from: data._id,
          to: currentChat._id,
        });

        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (currentChat) fetchMessages();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    try {
      const data = await JSON.parse(localStorage.getItem("chat-app-user"));
      await axios.post(addMsgRoute, {
        msg: msg,
        from: data._id,
        to: currentChat._id,
      });
      setMessages([...messages, { fromSelf: true, message: msg }]);

      if(socket.current){
        socket.current.emit("send-msg", {
          to: currentChat._id,
          from: data._id,
          msg,
        });
      }
      else {
        console.error("Socket is not connected!");
      }  
    } catch (error) {
      console.error("Couldn't send message:", error);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("receive-msg", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);
  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img src={currentChat.avatarImage} alt="" />
              </div>
              <div className="username">
                <h2>{currentChat.username}</h2>
              </div>
            </div>
            <div className="logout">
              <Logout />
            </div>
          </div>
          <div className="message-container">
            {messages.map((message, index) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    className={`message ${
                      message.fromSelf ? "sent" : "received"
                    }`}
                    key={index}
                  >
                    <div className="content">
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="chat-input">
            <ChatInput handleSendMsg={handleSendMsg} />
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (mind-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    align-items: center;
    display: flex;
    margin-top: 1.5rem;
    justify-content: space-between;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-left: 4rem;
      margin-top: 1rem;
      .avatar {
        img {
          height: 5rem;
        }
      }
      .username {
        color: white;
        text-transform: uppercase;
      }
    }
  }
  .message-container {
    margin-top: 1rem;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      align-items: center;
      display: flex;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sent {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer;
