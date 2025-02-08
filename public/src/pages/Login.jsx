import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "../assets/newlogo.png";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    draggable: true,
    autoClose: 5000,
    theme: "dark",
    pauseOnHover: true,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === true) {
        localStorage.setItem(
          "chat-app-user",
          JSON.stringify(data.user)
        );
        navigate("/");
      } else if (data.status === false) {
        toast.error(data.message, toastOptions);
      }
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { username, password } = values;
    if (password === "") {
      toast.error("Username and Password is required!", toastOptions);
      return false;
    } else if (username === "") {
      toast.error("Username and Password is required!", toastOptions);
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-current-user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <FormContainer>
        <form
          onSubmit={(event) => {
            handleSubmit(event);
          }}
        >
          <div className="brand">
            <img src={Logo} alt="" />
            <h1>Quick Chat</h1>
          </div>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <button type="submit">Login</button>
          <span>
            Don't have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  align-items: center;
  background-color: #5c5a91;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    align-items: center;
    justify-content: center;
    gap: 1rem;
    border-radius: 2rem;
    display: flex;
    flex-direction: column;
    background-color: #211c45;
    padding: 4rem 5rem;
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
  }
  input {
    align-items: left;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.5rem;
    width: 100%;
    background-color: transparent;
    color: white;
    font-size: 1rem;
    padding: 0.6rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
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
  span {
    color: white;
    text-transform: uppercase;
    font-size: 0.7rem;
    display: inline;
    a {
      text-decoration: none;
      color: #4e0eff;
    }
  }
`;

export default Login;
