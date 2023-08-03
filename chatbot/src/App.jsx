import React, { useState, useEffect } from "react";
import axios from "axios";
import Message from "./Message";

const API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const App = () => {
  
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // useEffect(() => {
  //   if (isTyping) {
  //     const timeoutId = setTimeout(() => {
  //       setIsTyping(false);
  //       sendRequest();
  //     }, 2000);

  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [isTyping]);

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = async () => {
    if (!inputText) return;
    setMessages([...messages, { role: "user", content: inputText }]);
    setInputText("");
    setIsTyping(true); 

    await sendRequest();

    setIsTyping(false);
  };

  const sendRequest = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      };

      const data = {
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "system",
            "content": "You are a helpful assistant."
          },
          {
            "role": "user",
            "content": inputText
          }
        ]
      };

      const response = await axios.post(API_URL, data, { headers });

      setMessages((prevMessages) => [
        ...prevMessages,
        // { role: "user", content: inputText },
        { role: "assistant", content: response.data.choices[0].message.content }
      ]);

      setInputText("");
    } catch (error) {
      console.error("Error al llamar a la API:", error);
    }
  };
  const preprocessContent = (content) => {
    const processedContent = content.replace(/\\n/g, "\n");
    return processedContent;
  };
  return (
    <div className="container">
      <h1>ChatGPT App</h1>
      <div className="chat-container"> 
        {messages.map((message, index) => (
          message.role === "user" ? <div
            key={index}
            className={`chat-bubble ${message.role === "user" ? "user-bubble" : "assistant-bubble"}`}
          >
            {message.content}
          </div> : <div
            key={index}
            className={`chat-bubble ${message.role === "user" ? "user-bubble" : "assistant-bubble"}`}
          >
            <Message content={preprocessContent(message.content)} />
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Asking ChatGPT...beeep...boop🤖</div>}
      </div>
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="Ask something here..."
        className="chat-input"
      />
      <button onClick={handleButtonClick} className="chat-button">Ask ChatGPT</button>
    </div>
  );
};

export default App;