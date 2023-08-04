/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import LoginForm from './components/login-form';
import { Route, Router, Routes } from '@solidjs/router';
import DreamFeed from './pages/dream-feed';
import SignUp from './components/sign-up';
import { Provider } from './components/auth-context-provider';
import Profile from './pages/profile';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <Provider>
    <Router>
      <Routes>
        <Route path="/" component={App}>
          <Route path="/dreamfeed" component={DreamFeed} />
          <Route path="/login" component={LoginForm} />
          <Route path="/signup" component={SignUp} />
          <Route path="/profile" component={Profile} />
        </Route>
      </Routes>
    </Router>
  </Provider>
),
  root!);
