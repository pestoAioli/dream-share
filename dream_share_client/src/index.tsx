/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { Route, Router, Routes } from '@solidjs/router';
import DreamFeed from './pages/dream-feed';
import SignUp from './components/sign-up';
import { Provider } from './components/auth-context-provider';
import Profile from './pages/profile';
import NewDream from './pages/new-dream';
import MyDreamFeed from './pages/my-dream-feed';
import Groups from './pages/groups';
import Login from './pages/login';
import FindUsers from './components/find-users';
import Users from './pages/users';

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
          <Route path="/dreams" component={DreamFeed} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/profile" component={Profile} />
          <Route path="/newdream" component={NewDream} />
          <Route path="/mydreams" component={MyDreamFeed} />
          <Route path="/users" component={Users} />
          <Route path="/groups" component={Groups} />
        </Route>
      </Routes>
    </Router>
  </Provider>
),
  root!);
