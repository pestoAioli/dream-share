import { Match, Show, Switch } from 'solid-js';
import type { Component } from 'solid-js';

import "./styles/app.css";
import { A, Outlet } from '@solidjs/router';
import { useAuth, useStore } from './components/auth-context-provider';

const App: Component = () => {
  const [token, setToken] = useAuth();
  const [currentUserInfo, setCurrentUserInfo] = useStore();

  return (
    <div class='home-container'>
      <div style={{ "display": "flex", "justify-content": "space-between" }}>
        <h1 class='home-title'><A href="/dreamfeed" class="icon-links">✨🔭®</A></h1>
        <Show when={token()}>
          <p style={{ "margin-right": "8px" }}>Logged in as <strong>{currentUserInfo.username}</strong> </p>
        </Show>
      </div>
      <div class='divider' />
      <div style={{ "height": "100%", "width": "100%", "display": "flex" }}>
        <div class="sidebar">
          <div class="icon-link-list">
            <div style={{ "display": "flex", "flex-direction": "column" }}>
              <A href="/mydreams" class="icon-links">📝</A>
              <A href="/groups" class="icon-links">👥</A>
            </div>
            <Switch>
              <Match when={token()}>
                <A href="/profile" class="icon-links">⚙️</A>
              </Match>
              <Match when={!token()}>
                <A href="/login" class="icon-links">⚙️</A>
              </Match>
            </Switch>
          </div>
          <div class="divider2" />
        </div>
        <div style={{ "flex-grow": "9", "height": "100%", "overflow": "scroll" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
