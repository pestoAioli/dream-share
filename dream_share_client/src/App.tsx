import { Match, Show, Switch } from 'solid-js';
import type { Component } from 'solid-js';

import "./styles/app.css";
import { A, Outlet } from '@solidjs/router';
import { useAuth, useStore } from './components/auth-context-provider';

const App: Component = () => {
  const [token, _setToken] = useAuth();
  const [currentUserInfo, _setCurrentUserInfo] = useStore();
  //using any for now because bip is experimental/not fully supported
  let bip: any = null;
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    bip = e;
  })
  function triggerInstall() {
    if (bip) {
      bip.prompt();
    } else {
      //aka not chrome(gd safari...), already installed, etc
      alert("To install on iPhone, click on share icon in your browser bar, then look for 'add to home screen', on android look for 'Install' in your browser menu")
    }
  }

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
              <A href="/newdream" class="icon-links">📝</A>
              <A href="/mydreams" class="icon-links">📒</A>
              <A href="/users" class="icon-links">👼</A>
              <A href="/groups" class="icon-links">👯</A>
              <button onClick={() => triggerInstall()} id='install'>install app</button>
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
      <div class='divider' />
    </div>
  );
};

export default App;
