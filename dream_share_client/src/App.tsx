import type { Component } from 'solid-js';

import socket from './socket';
import "./styles/app.css";
import { A, Outlet } from '@solidjs/router';

const connect = socket("room:lobby");
console.log(connect)

const App: Component = () => {
  return (
    <div class='home-container'>
      <h1 class='home-title'><A href="/dreamfeed" class="icon-links">✨🔭®</A></h1>
      <div class='divider' />
      <div style={{ "height": "100%", "width": "100%" }}>
        <div class="sidebar">
          <div class="icon-link-list">
            <div style={{ "display": "flex", "flex-direction": "column" }}>
              <A href="/mydreams" class="icon-links">📝</A>
              <A href="/groups" class="icon-links">👥</A>
            </div>
            <A href="/profile" class="icon-links">⚙️</A>
          </div>
          <div class="divider2" />
          <div style={{ "flex-grow": "9" }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
