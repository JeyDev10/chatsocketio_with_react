import React, { useEffect, useState } from 'react'
import Routes from './config/Routes'
import SocketContext from './context/socket'
import io from 'socket.io-client'

const SOCKET_URL = "http://localhost:3001"

function App(props) {


  const [socket, setSocket] = useState('')
  const [token, setToken] = useState(null)


  useEffect(async () => {
    const queryToken = token ? token : window.localStorage.getItem('token')
    const socketInit = await io(SOCKET_URL, {
      query: {
        token: queryToken
      }
    });
     await setSocket(socketInit)

  }, [token])

  return (
    <SocketContext.Provider value={{ socket, setToken }}>
      <Routes />
    </SocketContext.Provider>
  );
}

export default App;
