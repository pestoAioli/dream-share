import { A, useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";
import { Match, Show, Switch, createEffect, createSignal } from "solid-js";
import '../styles/login-form.css';
import { useAuth, useStore } from "./auth-context-provider";

const LoginForm: Component = () => {
  const [loggingIn, setLoggingIn] = createSignal(false);
  const [tokenActual, setToken] = useAuth();
  const [currentUserInfo, setCurrentUserInfo] = useStore();
  const navigate = useNavigate();
  async function login(e: SubmitEvent) {
    e.preventDefault();
    const target = e.target as HTMLInputElementLogin;
    const email = target.email.value;
    const password = target.password.value;
    setLoggingIn(true);
    const response = await fetch(import.meta.env.VITE_LOG_IN_URL, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
      },
      credentials: 'same-origin'
    })
    const { token, data } = await response.json();
    console.log(token)
    localStorage.setItem("toke", token)
    localStorage.setItem("id", data.user.id)
    localStorage.setItem("username", data.user.username)
    localStorage.setItem("fullname", data.user.full_name)
    setCurrentUserInfo("username", data.user.username)
    setCurrentUserInfo("fullname", data.user.full_name)
    setCurrentUserInfo("user_id", data.user.user_id)
    setLoggingIn(false);
    setToken(token)
    console.log(tokenActual(), "actual first", token, currentUserInfo);
    navigate("/newdream")
  }


  return (
    <div class='home-login'>
      <Show when={loggingIn() === false}>
        <div>
          <div class="hort" />
          <form class='home-login-form' onSubmit={login}>
            <input type="text" id="email" name="email" placeholder="email" required />
            <input type="text" id="password" name="password" placeholder="password" required
              style={{ "margin-top": "8px" }} />
            <button style={{ "margin-top": "8px", "border": "2px solid black", "background-color": "white", "color": "black" }} type="submit" ><strong>Login</strong></button>
          </form>
        </div>
        <p style={{ "margin-top": "0" }}>Don't have an account? <A href='/signup'>Sign up</A></p>
      </Show>
      <Show when={loggingIn() === true}>
        <h1>One sec while I log you in 🧐</h1>
      </Show>
    </div>

  );
}

export default LoginForm;
