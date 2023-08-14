import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import { Show, createSignal } from "solid-js";
import '../styles/login-form.css';
import LoginForm from "../components/login-form";

const Login: Component = () => {
  const [loggingIn, setLoggingIn] = createSignal(false);
  const [error, setError] = createSignal(false)

  return (
    <div class='home-login'>
      <Show when={loggingIn() === false}>
        <LoginForm setLoggingIn={setLoggingIn} setError={setError} />
        <p style={{ "margin-top": "0" }}>Don't have an account? <A href='/signup'>Sign up</A></p>
      </Show>
      <Show when={loggingIn() === true}>
        <Show when={!error()}>
          <h1>One sec while I log you in 🧐</h1>
        </Show>
        <Show when={error()}>
          <p>something went wrong :/ please <button style={{ "text-decoration": "underline" }} onClick={() => {
            setError(false)
            setLoggingIn(false)
          }}><b>refresh</b></button> and try again, and make sure you're logged in</p>
        </Show>
      </Show>
    </div>

  );
}

export default Login;
