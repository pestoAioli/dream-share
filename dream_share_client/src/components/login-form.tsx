import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import { Match, Switch, createSignal } from "solid-js";
import '../styles/login-form.css';

const LoginForm: Component = () => {
  const [loggingIn, setLoggingIn] = createSignal(false);

  async function login(e: SubmitEvent) {
    //@ts-ignore
    const hash_password = bcrypt.hash(e.target.password.value, 10, function(err, hash) {
      try {
        return hash;
      } catch (e) {
        console.log(e, err)
        return err;
      }
    })
    //@ts-ignore
    const email = e.target.email.value;
    e.preventDefault();
    setLoggingIn(true);
    const response = await fetch("http://localhost:4000/api/sign_in", {
      method: "POST",
      body: JSON.stringify({ email, hash_password })
    })
    const { token } = await response.json();
    sessionStorage.setItem("toke", token)
    setLoggingIn(false);
  }

  return (
    <Switch>
      <Match when={loggingIn() === false}>
        <div class='home-login'>
          <div>
            <div class="hort" />
            <form class='home-login-form' onSubmit={login}>
              <input type="text" id="email" name="email" placeholder="email" required />
              <input type="text" id="password" name="password" placeholder="password" required
                style={{ "margin-top": "8px" }} />
              <button style={{ "margin-top": "8px", "border": "2px solid black", "background-color": "white" }} type="submit" ><strong>Login</strong></button>
            </form>
          </div>
          <p style={{ "margin-top": "0" }}>Don't have an account? <A href='/signup'>Sign up</A></p>
        </div>
      </Match>
      <Match when={loggingIn() === true}>
        <h1>One sec while I log you in 🧐</h1>
      </Match>
    </Switch>
  );
}

export default LoginForm;
