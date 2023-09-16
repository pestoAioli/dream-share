/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { Route, Router, Routes } from '@solidjs/router';
import DreamFeed from './pages/dream-feed/dream-feed';
import SignUp from './pages/sign-up';
import { Provider } from './contexts/auth-context-provider';
import Profile from './pages/profile';
import NewDream from './pages/new-dream';
import MyDreamFeed from './pages/my-dreams/my-dream-feed';
import Login from './pages/login';
import Users from './pages/find-users/users';
import UserDreams from './pages/dreams-by-user/user-dreams';
import SearchForDreamsByKeywordWrapper from './pages/search-dreams-by-keyword/dreams-by-keyword-wrapper';

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
          <Route path="/user/:id" component={UserDreams} />
          <Route path="/searchdreams" component={SearchForDreamsByKeywordWrapper} />
        </Route>
      </Routes>
    </Router>
  </Provider>
),
  root!);
