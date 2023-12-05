import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavbarComponent from './components/NavbarComponent';
import LoginPage from './pages/LoginPage';
import RecipePage from './pages/RecipePage';

const socket = io(process.env.REACT_APP_SOCKET_ENDPOINT || 'http://localhost:3001');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };
  
  return (
    <Router>
      <NavbarComponent isLoggedIn={isLoggedIn} handleLogin={handleLogin} />
      <Switch>
        <Route path="/login">
          <LoginPage handleLogin={handleLogin} />
        </Route>
        <Route path="/recipes">
          <RecipePage isLoggedIn={isLoggedIn} socket={socket} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

