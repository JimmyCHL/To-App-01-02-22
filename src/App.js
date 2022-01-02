import React, { useRef, useState } from "react";
import styled from "styled-components";
import ListItem from "./components/ListItem";
import { auth, db } from "./firebase";
import Login from "./components/Login";
import Loading from "./components/Loading";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  query,
  writeBatch,
  getDocs,
  where,
} from "firebase/firestore";
import moment from "moment";

const App = () => {
  const [mode, setMode] = useState("all");
  const [darkMode, setDarkMode] = useState(true);
  const [time, setTime] = useState(moment().format("MMMM Do YYYY, h:mm:ss a"));
  const [user, loading, error] = useAuthState(auth);
  const [todoSnaps, dataLoading] = useCollection(
    query(
      collection(
        db,
        "users",
        localStorage.getItem("user_uid") || "null",
        "todos"
      ),
      orderBy("timestamp", "desc")
    )
  );
  const inputRef = useRef(null);

  // changeMode
  const ChangeMode = (mode) => {
    setMode(mode);
  };

  //addToDo to database
  const addTodo = async (e) => {
    e.preventDefault();
    if (inputRef.current.value.trim() === "") {
      return;
    }

    await addDoc(collection(db, "users", user.uid, "todos"), {
      todoThing: inputRef.current.value,
      completed: false,
      timestamp: serverTimestamp(),
    }).then((result) => {
      // console.log(result);
      console.log("successfully add an todo");
      inputRef.current.value = "";
    });
  };

  //deleteCompletedFunc
  const deleteCompletedFunc = async () => {
    const DocsSnap = await getDocs(
      query(
        collection(db, "users", user.uid, "todos"),
        where("completed", "==", true)
      )
    );
    //console.log(DocsSnap);
    const batch = writeBatch(db);
    DocsSnap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log(" successfully deleted all completed done todos.");
  };

  //changeBackgroundMode
  const changeBackgroundMode = () => {
    const htmlTag = document.getElementsByTagName("html")[0];
    if (htmlTag.hasAttribute("data-theme")) {
      htmlTag.removeAttribute("data-theme");
    } else {
      htmlTag.setAttribute("data-theme", "light");
    }

    setDarkMode((prev) => !prev);
  };

  //time
  setTimeout(() => setTime(moment().format("MMMM Do YYYY, h:mm:ss a")), 1000);

  if (loading || dataLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Container>
      <UpperLayer dark={darkMode}></UpperLayer>
      <DownLayer></DownLayer>
      <MainContainer>
        <Main dark={darkMode}>
          <TitleContainer>
            <span onClick={() => signOut(auth)}>TODO</span>
            {darkMode ? (
              <img onClick={changeBackgroundMode} src="/images/icon-sun.svg" />
            ) : (
              <img onClick={changeBackgroundMode} src="/images/icon-moon.svg" />
            )}
          </TitleContainer>
          <InputContainer>
            <div>
              <div></div>
            </div>
            <input ref={inputRef} placeholder="Create a new Todo..." />
            <button onClick={addTodo} hidden />
          </InputContainer>
          <ToDoLists>
            {todoSnaps?.docs.map((doc) => {
              if (mode == "all") {
                return <ListItem id={doc.id} key={doc.id} data={doc.data()} />;
              } else if (mode == "active") {
                if (doc.data().completed === false) {
                  return (
                    <ListItem id={doc.id} key={doc.id} data={doc.data()} />
                  );
                }
              } else {
                if (doc.data().completed === true) {
                  return (
                    <ListItem id={doc.id} key={doc.id} data={doc.data()} />
                  );
                }
              }
            })}
          </ToDoLists>
          <InfoContainer mode={mode}>
            <div>
              {
                todoSnaps?.docs.filter((doc) => doc.data().completed === false)
                  .length
              }{" "}
              items left
            </div>
            <div>
              <h2
                style={mode == "all" ? { color: "hsl(220, 98%, 61%)" } : {}}
                onClick={() => ChangeMode("all")}
              >
                All
              </h2>
              <h2
                style={mode == "active" ? { color: "hsl(220, 98%, 61%)" } : {}}
                onClick={() => ChangeMode("active")}
              >
                Active
              </h2>
              <h2
                style={
                  mode == "completed" ? { color: "hsl(220, 98%, 61%)" } : {}
                }
                onClick={() => ChangeMode("completed")}
              >
                Completed
              </h2>
            </div>
            <h2 onClick={deleteCompletedFunc}>Clear Completed</h2>
          </InfoContainer>
          <h3>{time}</h3>
        </Main>
      </MainContainer>
    </Container>
  );
};

export default App;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const UpperLayer = styled.div`
transition: all 0.5s ease-in-out;
  height: 40%;
  background-image: ${(props) =>
    props.dark
      ? `url("/images/bg-desktop-dark.jpg");`
      : `url("/images/bg-desktop-light.jpg");`} 
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  @media (max-width: 676px) {
    background-image: ${(props) =>
      props.dark
        ? `url("/images/bg-mobile-dark.jpg");`
        : `url("/images/bg-mobile-light.jpg");`} 
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
`;

const Main = styled.div`
  width: 80%;
  max-width: 700px;
  height: 600px;
  background-color: transparent;
  margin: 30px auto auto auto;
  display: flex;
  flex-direction: column;

  > h3 {
    text-align: center;
    margin-top: 10px;
    color: ${({ dark }) => (dark ? "white" : "black")};
    font-weight: 400;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30px;

  > span {
    color: white;
    font-size: 35px;
    letter-spacing: 15px;
    cursor: pointer;
  }
  > img {
    width: 35px;
    cursor: pointer;
  }
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--table-bg);
  margin-bottom: 30px;
  border-radius: 5px;
  > div {
    width: 20px;
    height: 20px;
    cursor: pointer;
    background-color: gray;
    border-radius: 50%;
    margin-right: 20px;
    padding: 2.5px;
    display:flex;
    justify-content:center;
   
    &:hover {
      background-image: linear-gradient(
        to left,
        hsl(192, 100%, 67%),
        hsl(280, 87%, 65%)
      );
    }

    > div {
      flex:1;
      background-color: var(--table-bg);
      border-radius: 50%;
      }
    }
  }

  > input {
    font-size: 22px;
    flex: 1;
    border: none;
    background: none;
    outline: none;
    color: var(--word-color);
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

const ToDoLists = styled.div`
  background-color: var(--table-bg);
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 1px 3px 15px black;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  padding: 15px;
  justify-content: space-between;
  border-top: 1px solid gray;
  background-color: var(--table-bg);
  color: var(--word-color);
  box-shadow: 1px 5px 15px black;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  > div {
    display: flex;

    > h2 {
      font-size: 16px;
      margin: 0 5px;
      cursor: pointer;

      :hover {
        text-decoration: underline;
        color: var(--word-color);
      }
    }
  }

  > h2 {
    font-size: 16px;
    cursor: pointer;
    :hover {
      text-decoration: underline;
      color: var(--word-color);
    }
  }

  @media (max-width: 676px) {
    flex-direction: column;
    align-items: center;
    > div {
      margin-bottom: 5px;
    }
  }
`;
