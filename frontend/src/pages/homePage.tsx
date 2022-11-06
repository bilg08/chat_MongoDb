import { type } from "@testing-library/user-event/dist/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

async function GetAccessTokenFromLocalStorage() {
    const token = await localStorage.getItem("token");
    return token
}

const connectChatServer = () => {
  const socket = io("http://localhost:8000/", {
    transports: ["websocket"],
  });
  return socket;
};
export const HomePage = () => {
  const [userInput, setUserInput] = useState("");
  const [IsSendMessage, setSendMessage] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState([{email:""}]);

    async function getTakeAllUsersData() {
        const accessToken = await GetAccessTokenFromLocalStorage()
    try {
      const data = await axios.get("http://localhost:8000/users", {
        headers: {
          Authorization: `Bearer `+accessToken,
        },
      });
      setAllUsers(data.data.data);
    } catch (error) {}
  }

  useEffect(() => {
    let socket = connectChatServer();
    socket.emit("chat message", userInput);
    return () => {
      socket.disconnect();
    };
  }, [IsSendMessage]);

  useEffect(() => {
    let socket = connectChatServer();
    socket.onAny((type, message) => {
      if (type === "chat message") {
        setMessages((m) => [...m, message]);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="w-full  h-[100vh] flex">
      <div className="w-[20%] bg-blue-500">
        <button
          onClick={getTakeAllUsersData}
          className="rounded bg-white px-8 py-2 m-5">
          Найзууд
        </button>
        <ul className="w-full flex justify-center items-center flex-col">
            {allUsers.length > 0 && allUsers.map((user, i) => <li className="w-full flex justify-center items-center flex-col">{ user.email}<button className="p-2 bg-white rounded m-auto">Харилцах</button></li>)}          
        </ul>
      </div>
      <div style={{ position: "relative", width: `80%`, background: "red" }}>
        <ul id="messages">
          {messages.map((message, i) => (
            <li key={message + i}>{message}</li>
          ))}
        </ul>
        <form
          style={{
            width: `100%`,
            position: "absolute",
            bottom: 0,
            background: "rgba(0,0,0,0.1)",
            display: `flex`,
            height: `3rem`,
            boxSizing: `border-box`,
            backdropFilter: `blur(10px)`,
          }}
          id="form"
          action="">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-[80%] bg-green-400"
            id="input"
          />
          <button
            onClick={async (e) => {
              e.preventDefault();
              await setSendMessage((e) => !e);
              setUserInput("");
            }}>
            Илгээх
          </button>
        </form>
      </div>
    </div>
  );
};
