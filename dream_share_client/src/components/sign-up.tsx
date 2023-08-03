import { Switch, Match, createSignal } from "solid-js";
import type { Component } from "solid-js";
import { useAuthContext } from "./auth-context-provider";
import * as bcrypt from "bcryptjs";
import { useNavigate } from "@solidjs/router";

const SignUp: Component = () => {
  const [signingUp, setSigningUp] = createSignal(false);
  const [greetingName, setGreetingName] = createSignal("");
  const navigate = useNavigate();
  async function signUp(e: SubmitEvent) {
    e.preventDefault();
    //@ts-ignore
    const password = e.target.password.value
    //@ts-ignore
    const email = e.target.email.value;
    //@ts-ignore
    const username = e.target.username.value
    setSigningUp(true);
    const response = await fetch("http://localhost:4000/user/register", {
      method: "POST",
      body: JSON.stringify({ user: { email, password, username } }),
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
      },
      credentials: 'same-origin'
    })
    const { data } = await response.json();
    console.log(data)
    setSigningUp(false);
    setGreetingName(data.username)
    console.log(greetingName())
  }

  function goToLogin() {
    return navigate("/login")
  }

  return (
    <Switch>
      <Match when={signingUp() === false && greetingName().length == 0}>
        <div class='home-login'>
          <div>
            <div class="hort" />
            <form class='home-login-form' onSubmit={signUp}>
              <input type="text" id="email" name="email" placeholder="email" required />
              <input type="text" id="password" name="password" placeholder="password" required
                style={{ "margin-top": "8px" }} />
              <input type="text" id="username" name="username" placeholder="username" required
                style={{ "margin-top": "8px" }} />
              <button style={{ "margin-top": "8px", "border": "2px solid black", "background-color": "white" }} type="submit" ><strong>Sign up 🙋</strong></button>
            </form>
          </div>
        </div>
      </Match>
      <Match when={signingUp() === true}>
        <h1>One sec while I sing yuo up🧐</h1>
      </Match>
      <Match when={greetingName().length != 0 && signingUp() === false}>
        <div class="home-login">
          <div>
            <div class="hort" />
            <p>thanks for joining <strong>{greetingName()}!</strong> </p>
            <p>please <button onClick={goToLogin}><strong>login</strong></button> now with yuor new account</p>
          </div>
        </div>
      </Match>
    </Switch>
  );
}

export default SignUp;
