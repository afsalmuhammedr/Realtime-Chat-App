import React from 'react'
import { useNavigate } from 'react-router-dom';
import { BiPowerOff } from 'react-icons/bi';
import styled from 'styled-components';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () =>{
        localStorage.clear();
        navigate("/login");
    }

  return (
    <div>
        <Button>
            <BiPowerOff onClick={handleLogout}/>
        </Button>
    </div>
  )
}

const Button = styled.button`
display: flex;
align-items: center;
justify-content: center;
margin-right: 1.5rem;
border-radius: 0.5rem;
background-color: #9a86f3;
padding: 0.1rem;
cursor: pointer;
svg{
    font-size: 2rem;
    color: #ebe7ff;
}
`;
export default Logout
