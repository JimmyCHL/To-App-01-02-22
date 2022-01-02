import React from "react";
import styled from "styled-components";
import Spinner from "react-spinkit";

const Loading = () => {
  return (
    <Container>
      <UpperLayer />
      <DownLayer />
      <MainContainer>
        <div>
          <h1>Loading...</h1>
          <Spinner name="ball-spin-fade-loader" color="purple" />
        </div>
      </MainContainer>
    </Container>
  );
};

export default Loading;

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

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
      margin-top: -200px;
      margin-bottom: 150px;
      font-size: 50px;
    }
  }
`;
