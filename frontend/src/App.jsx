import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'

export const socket = io(import.meta.env.VITE_BACKEND_URL);

function App() { 
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log(import.meta.env.VITE_BACKEND_URL)
  }, [])

  socket.on('chat message', (msg) => {
    const newMessages = [...messages, msg];
    setMessages(newMessages)
  })

  async function postMessages(){
    try {
      const PostMessage = {message}

      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/chat', {
        method: 'POST',
        body: JSON.stringify(PostMessage),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const json = await response.json()

      console.log('json', json)

      if(!response.ok){
        console.log(json.error)
      }
      if(response.ok){
        setMessage('')
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/chat');
        const json = await response.json();
  
        if (response.ok) {
          const messagesList = json.messages.map((message) => message.message);
          
          setMessages(messagesList);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  
    fetchMessages();
  }, []); 

  return (
    <>
      <ul className="messages">
        {messages.map((message, index) => {
          return(
            <li key={index}>{message}</li>
          )
        })}
      </ul>
      <form onSubmit={(e) => {
        e.preventDefault();
        if(message) {
          socket.emit('chat message', message);
          setMessage('')
          console.log('hi')
          postMessages()
        }
      }} className="form">
        <input type="text" className="input" onChange={(e) => {setMessage(e.target.value)}} value={message} />
        <button>Send</button>
      </form>
    </>
  )
}

export default App
