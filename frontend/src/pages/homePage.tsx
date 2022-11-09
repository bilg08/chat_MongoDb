import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useIsUserLoggedContext } from "../context/isUserLogged";
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
  const [IsSendMessage, setSendMessage] = useState(false);
  const [messages, setMessages] = useState([{createdAt:"",id:"",message:"",_id:""}]);
  const [friends, setFriends] = useState([{friend:'',chatRoomName:""}])
  const [allUsers, setAllUsers] = useState([{ email: "", _id: "" }]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [chatRoom, setChatRoom] = useState('');
  const [message, setMessage] = useState('');
  const listRef = useRef<HTMLElement | any>();
  const {setIsUserLogged} = useIsUserLoggedContext()


  async function getChats() {
    const accessToken = await GetAccessTokenFromLocalStorage();
    try {
      const data = await axios.get(`http://localhost:8000/friends/${chatRoom}/chats`, {
        headers: {
          Authorization: `Bearer ` + accessToken,
        },
      });
      setMessages(data.data.data)
      scrollToLastMessage()
    } catch (error) { }

  }
  function scrollToLastMessage() {
    let lastChild = listRef.current.lastChild;
    lastChild.scrollIntoView({
      block: 'end',
      inline: "nearest",
      behavior:'smooth'
    });
  }
  useEffect(() => {
    getChats();
  },[chatRoom,IsSendMessage])

  async function getFriendRequests() {
    const accessToken = await GetAccessTokenFromLocalStorage()
    try {
      const data = await axios.get("http://localhost:8000/friends/allFriendRequests", {
        headers: {
          Authorization: `Bearer ` + accessToken,
        },
      });
     setFriendRequests(data.data.data)
    } catch (error) { }
  }

  async function signOut() {
    await localStorage.clear();
    setIsUserLogged(false)

}


  async function getTakeAllUsersData() {
    const accessToken = await GetAccessTokenFromLocalStorage()
    try {
      const data = await axios.get("http://localhost:8000/users", {
        headers: {
          Authorization: `Bearer ` + accessToken,
        },
      });
      console.log(data.data)
      setAllUsers(data.data.data);
    } catch (error) { }
  }

  useEffect(() => {
    getTakeAllUsersData();
    getFriends();
    getFriendRequests()
  }, [])


  async function getFriends() {
    const accessToken = await GetAccessTokenFromLocalStorage()

    try {
      const data = await axios.get("http://localhost:8000/friends", {
        headers: {
          Authorization: `Bearer ` + accessToken,
        },
      });
      setFriends(data.data.data)
    } catch (error) { }
  }

  async function confirmFriendRequest(id:String) {
    const accessToken = await GetAccessTokenFromLocalStorage()

    try {
      const data = await axios.post("http://localhost:8000/friends/confirmFriendRequest",{receiver:id}, {
        headers: {
          Authorization: `Bearer ` + accessToken,
        },
      });
      
    } catch (error) { }
  }






  async function sendFriendRequest(id: String) {
    const accessToken = await GetAccessTokenFromLocalStorage()
    try {
      const data = await axios.post("http://localhost:8000/friends/friendRequest", { receiver: id }, {
        headers: {
          Authorization: `Bearer ` + accessToken,
        },
      });

    } catch (error) { }
  }
  useEffect(() => {
   async function sendMessage() {
    const accessToken = await GetAccessTokenFromLocalStorage()
    try {
      const data = await axios.post(`http://localhost:8000/friends/${chatRoom}/sendMessage`, {message} ,{
        headers: {
          Authorization: `Bearer ` + accessToken,
        },
      });

    } catch (error) { }
    }
    if(message!==""&&chatRoom!=="") sendMessage()
},[IsSendMessage])



  useEffect(() => {
    let socket = connectChatServer();
    socket.emit("chat message", message);
    return () => {
      socket.disconnect();
    };
  }, [IsSendMessage]);

  useEffect(() => {
    let socket = connectChatServer();
    socket.onAny((type, message) => {
      if(message)   setSendMessage(e=>!e)
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="w-full  h-[100vh] flex">
      <div className="w-[40%] bg-blue-500">
        <div className="bg-green-500 h-[200px]">
          <div>
            <h1 className="text-lg text-white">Найзууд</h1>
          </div>
          <ul className="w-full flex justify-center items-center flex-col">
            {friends.map(friend => <li key={friend.friend}>{friend.friend}
              <button
                onClick={() =>setChatRoom(friend.chatRoomName.toLowerCase())}
                className="p-2 bg-white rounded m-auto">
                Харилцах</button></li>)}
          </ul>
        </div>
        <div>
          <div className="bg-yellow-500 h-[200px]">
            <h1 className="text-lg text-white">Хүмүүс</h1>
            <ul className="w-full flex justify-center items-center flex-col">
              {allUsers.length > 0 && allUsers.map((user, i) => <li key={user.email + i} className="w-full flex justify-center items-center flex-col"><span className="flex flex-col">{user._id}</span><button className="p-2 bg-white rounded m-auto"
                onClick={async () => { sendFriendRequest(user._id) }}
              >Найз болох</button></li>)}
            </ul>
          </div>
          <div className="bg-pink-500 h-[200px]">
            <h1 className="text-lg text-white">Найзын хүсэлт</h1>
            <ul className="w-full flex justify-center items-center flex-col">
              {friendRequests.length > 0 && friendRequests.map((user, i) => <li key={i} className="w-full flex justify-center items-center flex-col"><span className="flex flex-col">{user}</span>
              <button onClick={()=>confirmFriendRequest(user)}
              className="p-2 bg-white rounded m-auto"
              >Найз болох</button></li>)}
            </ul>
          </div>


      <button onClick={()=>signOut()} className="p-2 bg-white rounded m-auto">Гарах</button>
        </div>
      </div>
      <div style={{ position: "relative", width: `80%`, background: "red" }}>
        <ul ref={listRef} id="messages" style={{overflow:'scroll',height:`400px`}} className="bg-pink-200">
          {messages.map((message, i) => (
            <li key={message.message+i}>{message.message}</li>
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-[80%] bg-green-400"
            id="input"
          />
          <button
            onClick={async (e) => {
              if (message !== "" && chatRoom !== "") {
                e.preventDefault();
              await setSendMessage((e) => !e);
              setMessage("");
              } else {
                 e.preventDefault();
              }
            }}>
            Илгээх
          </button>
        </form>
      </div>

    </div>
  );
};
