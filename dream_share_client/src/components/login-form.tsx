import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import { Match, Switch, createEffect, createSignal } from "solid-js";
import '../styles/login-form.css';
import { useAuthContext } from "./auth-context-provider";
import * as bcrypt from "bcryptjs";

const LoginForm: Component = () => {
  const [loggingIn, setLoggingIn] = createSignal(false);
  const [isAuthenticated, _setIsAuthenticated] = useAuthContext();

  async function login(e: SubmitEvent) {
    //@ts-ignore
    const email = e.target.email.value;
    //@ts-ignore
    const hash_password = e.target.password.value;
    e.preventDefault();
    console.log(JSON.stringify({ email, hash_password }))
    setLoggingIn(true);
    const response = await fetch("http://localhost:4000/api/accounts/sign_in", {
      method: "POST",
      body: JSON.stringify({ email, hash_password }),
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
      },
      credentials: 'same-origin'
    })
    const { token, id } = await response.json();
    console.log(token)
    localStorage.setItem("toke", JSON.stringify(token))
    localStorage.setItem("id", id)
    setLoggingIn(false);
    console.log(isAuthenticated(), token);
  }

  createEffect(() => {
    console.log(isAuthenticated())
  })

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
