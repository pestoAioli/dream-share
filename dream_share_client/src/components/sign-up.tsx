import { Switch, Match, createSignal } from "solid-js";
import type { Component } from "solid-js";

const SignUp: Component = () => {
  const [signingUp, setSigningUp] = createSignal(false);


  return (
    <Switch>
      <Match when={signingUp() === false}>
        <div class='home-login'>
          <div>
            <div class="hort" />
            <form class='home-login-form' onSubmit={signUp}>
              <input type="text" id="email" name="email" placeholder="email" required />
              <input type="text" id="password" name="password" placeholder="password" required
                style={{ "margin-top": "8px" }} />
              <button style={{ "margin-top": "8px", "border": "2px solid black", "background-color": "white" }} type="submit" ><strong>Login</strong></button>
            </form>
          </div>
        </div>
      </Match>
      <Match when={signingUp() === true}>
        <h1>One sec while I sing yuo up🧐</h1>
      </Match>
    </Switch>
  );
} 
