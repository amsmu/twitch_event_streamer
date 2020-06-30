import React from 'react';
import { Route } from 'react-router-dom';
import Login from './Login';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Route exact path='/' component={Login} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/search/:username' component={Login} />
    </div>
  );
}

export default App;
