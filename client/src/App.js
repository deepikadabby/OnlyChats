import './App.css';
import Dashboard from './modules/dashboard';
import Form from './modules/form';
import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { socket } from './socket';

const Protective = ({ children, auth = false }) => {
  const isLogged = localStorage.getItem('user:token') != null || false;
  if (!isLogged && auth) {
    return <Navigate to={'User/sign_in'} />
  }
  else if (isLogged && ['/user/sign_in', '/user/sign_up'].includes(window.Location.pathname)) {
    console.log('object :>>');
    return <Navigate to={'/'} />
  }
  return children;
}

function App() {
  const msgRef = useRef();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);
  useEffect(() => {
    function onConnect() {
      console.log(`I'm connected with the back-end`);
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);
    socket.on('message', (msg)=>{
      msgRef.current.onMessage(msg)
    });
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <Protective auth={true}>
          <Dashboard ref={msgRef}/>
        </Protective>
      } />
      <Route path="/user/sign_in" element={<Protective><Form isSignin={true} /></Protective>} />
      <Route path="/user/sign_up" element={<Protective><Form isSignin={false} /></Protective>} />
    </Routes>
  );
}

export default App;
