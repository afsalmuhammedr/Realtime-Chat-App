import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getAllUsers, host } from "../utils/APIRoutes";
import axios from "axios";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

const Chat = () => {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchuser = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    };
    fetchuser();
  }, [navigate]);

  useEffect(() => {
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);
  useEffect(() => {
    const checkUserAvatar = async () => {
      if (currentUser) {
        //console.log(currentUser);
        if (currentUser.isAvatarActive) {
          const { data } = await axios.post(
            `${getAllUsers}/${currentUser._id}`
          );
          setContacts(data);
          console.log(contacts);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    checkUserAvatar();
  }, [currentUser, navigate]);

  const handleChangeChat = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChangeChat}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  display: grid;
  background-color: #5c5a91;
  .container {
    height: 85vh;
    width: 90vw;
    display: grid;
    background-color: #250e43;
    border-radius: 2rem;
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
