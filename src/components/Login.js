import React from "react";
import styled from "styled-components";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Login = () => {
  const googleLogin = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider())
      .then((results) => {
        localStorage.setItem("user_uid", results.user.uid);
        console.log("you have logined!");
        return;
      })
      .catch((e) => console.log(e.message));
  };

  return (
    <Container>
      <UpperLayer></UpperLayer>
      <DownLayer></DownLayer>
      <MainContainer>
        <h1>Todo App</h1>
        <div onClick={googleLogin}>Google Login</div>
      </MainContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const UpperLayer = styled.div`
  height: 40%;
  background-image: url("/images/bg-desktop-dark.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  @media (max-width: 676px) {
    background-image: url("/images/bg-mobile-dark.jpg");
    background-position: left center;
  }
`;

const DownLayer = styled.div`
  background-color: var(--main-bg);
  flex: 1;
`;

const MainContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: grid;
  place-items: center;

  > h1 {
    font-size: 50px;
  }

  > div {
    color: white;
    background-color: darkorange;
    padding: 20px;
    font-size: 30px;
    border-radius: 5px;
    cursor: pointer;

    :hover {
      box-shadow: 1px 1px 20px black;
    }
    :active {
      background-color: orange;
    }
  }
`;
