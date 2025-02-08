import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "../assets/loader.gif";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";

function SetAvatar() {
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    draggable: true,
    autoClose: 5000,
    theme: "dark",
    pauseOnHover: true,
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.random()}`;
        data.push(avatarUrl);
      }
      setAvatars(data);
      setIsLoading(false);
    };
    if(!localStorage.getItem("chat-app-user")){
      navigate("/login");
    }
    fetchAvatars();
  }, [navigate]);

  const setProfilePicture =async() =>{
    if(selectedAvatar === undefined){
      toast.error("Please select an Avatar!", toastOptions)
    }
    else{
      const user =await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`,{
        image: avatars[selectedAvatar]
      });

      if(data.isSet){
        user.isAvatarActive = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user",JSON.stringify(user));
        navigate("/");
      }
    }
  }

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={Loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Select an Avatar as Profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={avatar}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn" >Select Avatar</button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #181445;
  gap: 1rem;
  height: 100vh;
  width: 100vw;
  .title-container {
    justify-content: center;
    align-items: center;
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      background-color: #83fa6b;
      margin: 0.4rem;
      img {
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    margin-top: 2rem;
    font-size: 1.3rem;
    padding: 1rem 2rem;
    background-color: #7846ab;
    color: white;
    border-radius: 0.6rem;
    &:hover {
      background-color: #741ec9;
      cursor: pointer;
    }
  }
`;

export default SetAvatar;
