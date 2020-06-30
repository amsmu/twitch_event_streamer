import React from 'react';
import { Route } from 'react-router-dom';
import Login from './views/Login';
import Search from './views/Search';
import Dashboard from './views/Dashboard';
import 'antd/dist/antd.css';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Route exact path='/' component={Search} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/view/:username' component={Dashboard} />
    </div>
  );
}

export default App;
