import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Logo from '../assets/newlogo.png'

function Contacts({contacts =[],currentUser, changeChat}) {
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserImage, setCurrentUserImage] = useState("");
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() =>{
    const fetchUser = async() =>{
      if(currentUser){
        setCurrentUserName(currentUser.username);
        setCurrentUserImage(currentUser.avatarImage);
      }
    }
    fetchUser();
  },[currentUser])

  const changeCurrentChat = (index, contact) =>{
    setCurrentSelected(index);
    changeChat(contact)
  }
  return (
    <>
    {currentUser && currentUserImage &&(
      <Container>
        <div className="brand">
          <img src={Logo} alt="logo" />
          <h2>Quick Chat</h2>
        </div>
        <div className="contacts">
          {contacts.map((contact, index)=>{
            return(
              <div className={`contact ${index === currentSelected? "selected":""}`} key={index} onClick={()=>changeCurrentChat(index, contact)}>
                <img src={contact.avatarImage} alt="" />
                <h4>{contact.username}</h4>
              </div>
            )
          })}
        </div>
        <div className="current-user">
          <div className="avatar"><img src={currentUserImage} alt="" /></div>
          <div className="username">
          <h2>{currentUserName}</h2>
          </div>
        </div>
      </Container>
    )
    }
    </>
  )
}

const Container = styled.div`
display: grid;
grid-template-rows: 10% 75% 15%;
overflow: hidden;
background-color: #080420;
border-radius: 2rem;
box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
.brand{
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  img{
    height: 3rem;
  }
  h2{
    text-transform: uppercase;
    color: white;
  }
}
.contacts{

  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow: auto;
  gap: 0.7rem;
  &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
  .contact{
    background-color: #28184d;
    border-radius: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;
    transition: 0.3s ease-in-out;
    &:hover{
      cursor: pointer;
    }
    img{
      height: 4rem;
    }
    h4{
      text-transform: uppercase;
      color: white;
    }
  }
  .selected{
    background-color: #4e0eff;
  }
}
.current-user {
    background-color: #4f3391;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 5rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        text-transform: uppercase;
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
export default Contacts
