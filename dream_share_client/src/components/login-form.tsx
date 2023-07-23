import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import '../styles/login-form.css';

const LoginForm: Component = () => {
  return (
    <>
      <div class='home-login'>
        <div>
          <div class="hort" />
          <form class='home-login-form'>
            <input placeholder='email' />
            <input placeholder='password' style={{ "margin-top": "8px" }} />
          </form>
        </div>
        <p>Don't have an account? <A href='/signup'>Sign up</A></p>
      </div>
    </>
  );
}

export default LoginForm;
