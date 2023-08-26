import { useNavigate } from "@solidjs/router";
import type { Component, Setter } from "solid-js";
import '../styles/login-form.css';
import { useAuth, useStore } from "../contexts/auth-context-provider";

const LoginForm: Component<{ setLoggingIn: Setter<boolean>, setError: Setter<boolean> }> = ({ setLoggingIn, setError }) => {
  const [tokenActual, setToken] = useAuth();
  const [currentUserInfo, setCurrentUserInfo] = useStore();
  const navigate = useNavigate();
  async function login(e: SubmitEvent) {
    e.preventDefault();
    try {
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
        }
      })
      const { token, data } = await response.json();
      localStorage.setItem("toke", token)
      localStorage.setItem("id", data.user.id)
      localStorage.setItem("username", data.user.username)
      localStorage.setItem("fullname", data.user.full_name)
      setCurrentUserInfo("username", data.user.username)
      setCurrentUserInfo("fullname", data.user.full_name)
      setCurrentUserInfo("user_id", data.user.user_id)
      setLoggingIn(false);
      setToken(token)
      navigate("/newdream")
    } catch (e) {
      setError(true)
    }
  }


  return (
    <div>
      <div class="hort" />
      <form class='home-login-form' onSubmit={login}>
        <input type="text" id="email" name="email" placeholder="email" required />
        <input type="password" id="password" name="password" placeholder="password" required
          style={{ "margin-top": "8px" }} />
        <button class="submit-button" type="submit" ><strong>Login</strong></button>
      </form>
    </div>
  );
}

export default LoginForm;
