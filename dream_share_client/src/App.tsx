import type { Component } from 'solid-js';

import socket from './socket';
import "./app.css";
import { A } from '@solidjs/router';

const connect = socket("room:lobby");
console.log(connect)

const App: Component = () => {
  return (
    <div class='home-container'>
      <h1 class='home-title'>DreamShare, inc. 🔭</h1>
      <div class='home-login'>
        <form class='home-login-form'>
          <input placeholder='email' />
          <input placeholder='password' style={{ "margin-top": "8px" }} />
        </form>
        <p>Don't have an account? <A href='/login'>Sign up</A></p>
      </div>
    </div>
  );
};

export default App;
