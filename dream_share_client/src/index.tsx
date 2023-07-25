/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import LoginForm from './components/login-form';
import { Route, Router, Routes } from '@solidjs/router';
import DreamFeed from './pages/dream-feed';
import { SocketContextProvider } from './components/socket-context-provider';
import socket from './socket';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <SocketContextProvider>
    <Router>
      <Routes>
        <Route path="/" component={App}>
          <Route path="/dreamfeed" component={DreamFeed} />
          <Route path="/login" component={LoginForm} />
        </Route>
      </Routes>
    </Router>
  </SocketContextProvider>
),
  root!);
