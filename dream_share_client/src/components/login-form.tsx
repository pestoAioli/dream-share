import { A, useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";
import { Match, Show, Switch, createEffect, createSignal } from "solid-js";
import '../styles/login-form.css';
import { useAuth, useStore } from "./auth-context-provider";
import * as bcrypt from "bcryptjs";

const LoginForm: Component = () => {
  const [loggingIn, setLoggingIn] = createSignal(false);
  const [tokenActual, setToken] = useAuth();
  const [currentUserInfo, setCurrentUserInfo] = useStore();
  const navigate = useNavigate();
  async function login(e: SubmitEvent) {
    //@ts-ignore
    const email = e.target.email.value;
    //@ts-ignore
    const password = e.target.password.value;
    e.preventDefault();
    setLoggingIn(true);
    const response = await fetch("http://localhost:4000/user/log_in", {
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
    navigate("/profile")
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
            <button style={{ "margin-top": "8px", "border": "2px solid black", "background-color": "white" }} type="submit" ><strong>Login</strong></button>
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
