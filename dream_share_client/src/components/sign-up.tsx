import { Switch, Match, createSignal } from "solid-js";
import type { Component } from "solid-js";
import { useAuthContext } from "./auth-context-provider";
import * as bcrypt from "bcryptjs";
import { useNavigate } from "@solidjs/router";

const SignUp: Component = () => {
  const [signingUp, setSigningUp] = createSignal(false);
  const [isAuthenticated, setIsAuthenticated] = useAuthContext();
  const navigate = useNavigate();
  async function signUp(e: SubmitEvent) {
    e.preventDefault();
    //@ts-ignore
    const hash_password = e.target.password.value
    //@ts-ignore
    const email = e.target.email.value;
    console.log(JSON.stringify({ email, hash_password }))
    setSigningUp(true);
    const response = await fetch("http://localhost:4000/api/accounts/create", {
      method: "POST",
      body: JSON.stringify({ account: { email, hash_password } }),
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
    setSigningUp(false);
    navigate("/profile")
  }

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
              <button style={{ "margin-top": "8px", "border": "2px solid black", "background-color": "white" }} type="submit" ><strong>Sign up 🙋</strong></button>
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

export default SignUp;
