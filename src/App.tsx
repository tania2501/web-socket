import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.css";

type DataType = {
  message: string;
  photo: string;
  userId: number;
  userName: string;
};
function App() {
  const [users, setUsers] = useState<DataType[]>([]);
  const [message, setMessage] = useState('')
  const [ws, setWS] = useState<WebSocket | null>(null);

  useEffect(() => {
    setWS(new WebSocket("wss://social-network.samuraijs.com/handlers/ChatHandler.ashx"));
  }, []);
  const changeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value)
  }
  if(ws) {
    ws.onmessage = (event: MessageEvent) => {
      let newMessage = JSON.parse(event.data);
      setUsers([...users, ...newMessage]);
    };
  }
  const send = () => {
    if (ws) {
      ws.send(message);
      setMessage("");
    }
  }
  return (
    <div className="App">
      <div
        style={{ border: "2px solid black", margin: "0 auto", width: "480px", overflowY: "scroll", height:'80vh', padding: '10px' }}
      >
        {users.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-end", marginBottom: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <img
                src={
                  m.photo
                    ? m.photo
                    : "https://cdn4.iconfinder.com/data/icons/user-avatar-flat-icons/512/User_Avatar-31-512.png"
                }
                alt="#"
                style={{borderRadius: '50%'}}
              />
              <span>{m.userName}</span>
            </div>

            <p
              style={{
                backgroundColor: "#b5eae8",
                width: "350px",
                border: "1px solid rgb(238 188 210)",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
            >
              {m.message}
            </p>
          </div>
        ))}
      </div>
      <div style={{display: 'flex', justifyContent: 'center', border: '2px solid black', width: '480px', margin: '10px auto', padding: '10px'}}>
          <textarea style={{width: '300px', padding: '5px'}} value={message} onChange={changeMessage}></textarea> 
          <button onClick={send}>Send</button>
        </div>
    </div>
  );
}

export default App;
