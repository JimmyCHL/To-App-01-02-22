import React from "react";
import styled from "styled-components";
import TimeAgo from "react-timeago";
import { db } from "../firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

const ListItem = ({ id, data }) => {
  const checkedFun = () => {
    setDoc(
      doc(db, "users", localStorage.getItem("user_uid"), "todos", id),
      {
        completed: !data.completed,
      },
      { merge: true }
    ).then((doc) => {
      console.log("checked or unchecked todos successfully!");
    });
  };

  const deleteTodo = async () => {
    await deleteDoc(
      doc(db, "users", localStorage.getItem("user_uid"), "todos", id)
    ).then((result) => {
      console.log("todo deleted successfully");
    });
  };

  return (
    <Container completed={data.completed}>
      <div onClick={checkedFun}>
        {data.completed ? <img src="/images/icon-check.svg" /> : <div></div>}
      </div>
      <p
        onClick={checkedFun}
        style={
          data.completed
            ? { opacity: "0.2", textDecoration: "line-through" }
            : {}
        }
      >
        {data.todoThing}
      </p>
      <h6>
        {data.timestamp ? <TimeAgo date={data.timestamp.seconds * 1000} /> : ""}
      </h6>
      <img onClick={deleteTodo} src="/images/icon-cross.svg" />
    </Container>
  );
};

export default ListItem;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 15px;
  background-color: var(--table-bg);
  border-bottom: 1px solid gray;
  position:relative;

  > div {
    width: 20px;
    height: 20px;
    cursor: pointer;
    ${(props) =>
      props.completed
        ? `background-image: linear-gradient(
        to left,
        hsl(192, 100%, 67%),
        hsl(280, 87%, 65%)
      );`
        : "background-color: gray;"}
    
    border-radius: 50%;
    margin-right: 20px;
    padding: 2.5px;
    display:flex;
    justify-content:center;
    border-bottom: 1px solid gray;
    
    &:hover {
      background-image: linear-gradient(
        to left,
        hsl(192, 100%, 67%),
        hsl(280, 87%, 65%)
      );
    }

    > img{
      align-self:center;
      width: 15px;
      height: 15px;
      object-fit: cover;
    }

    > div {
      flex:1;
      background-color: var(--table-bg);
      border-radius: 50%;
      }
    }
  }

  > p {
    font-size: 22px;
    cursor: pointer;
    flex: 1;
    border: none;
    background: none;
    outline: none;
    color: var(--word-color);
    @media(max-width:650px){
      font-size: 16px;
    }
    &:hover {
      color:lightpink;
    }
  }

  >h6{
    color: gray;
    margin-right: 5px;
    @media(max-width:650px){
      position:absolute;
      bottom:2px;
      left:50px;
    }
  }

  >img {
      cursor: pointer;
      border-radius:100%;
      padding:2px;
      :hover{
          box-shadow: 1px 1px 10px black
      }
  }

  @media (max-width: 676px) {
    > div {
      width: 16px;
      height: 16px;
    }
    > input {
      font-size: 16px;
    }
  }
`;
