import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import { Show, createSignal } from "solid-js";
import '../styles/login-form.css';
import LoginForm from "../components/login-form";

const Login: Component = () => {
  const [loggingIn, setLoggingIn] = createSignal(false);

  return (
    <div class='home-login'>
      <Show when={loggingIn() === false}>
        <LoginForm setLoggingIn={setLoggingIn} />
        <p style={{ "margin-top": "0" }}>Don't have an account? <A href='/signup'>Sign up</A></p>
      </Show>
      <Show when={loggingIn() === true}>
        <h1>One sec while I log you in 🧐</h1>
      </Show>
    </div>

  );
}

export default Login;
