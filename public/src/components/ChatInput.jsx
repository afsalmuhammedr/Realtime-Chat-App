import React, { useState } from "react";
import styled from "styled-components";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";

function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    setMsg((prevMsg) => prevMsg + emojiObject.emoji);
  };

  const sendChat = (event) =>{
    event.preventDefault()
    if(msg.length>0){
      handleSendMsg(msg);
      setMsg("")
    }
  }

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
      <form className="chat-input" onSubmit={(event) =>sendChat(event)}>
        <input
          type="text"
          placeholder="Type your message here..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="submit">
            <IoMdSend/>
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  background-color: #080420;
  padding: 1rem;
  grid-template-columns: 5% 95%;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    margin-left: 0.5rem;

    .emoji {
      position: relative;

      svg {
        font-size: 1.7rem;
        color: yellow;
        cursor: pointer;
      }

      .emoji-picker-container {
        position: absolute;
        bottom: 50px;
        left: 0;
        z-index: 10;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar{
            background-color: #080420;
            width: 5px;
            &-thumb{
                background-color: #9a86f3;
            }
        }
        .emoji-categories{
            button{
                filter: contrast(0);
            }
        }
        .emoji-search{
            background-color: transparent;
            border-color: #9a86f3;
        }
        .emoji-group:before{
            background-color: #080420;
        }
      }
    }
  }
  .chat-input{
    width: 100%;
    height: 100%;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 70%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
  }
  .submit{
    width:7%;
    height: 100%;
    background-color: #9a86f3;
    border-radius: 5px;
    cursor: pointer;
    svg{
        font-size: 1.3rem;
        color: white;
    }
  }
`;

export default ChatInput;
