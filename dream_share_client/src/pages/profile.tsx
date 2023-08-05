import { useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";
import { Show, createSignal } from "solid-js";
import { useAuth, useStore } from "../components/auth-context-provider";

const Profile: Component = () => {
  const [signingOut, setSigningOut] = createSignal(false);
  const [token, setToken] = useAuth();
  const [currentUserInfo, setCurrentUserInfo] = useStore();
  const [updatingUserInfo, setUpdatingUserInfo] = createSignal(false);
  const navigate = useNavigate();
  async function signOut() {
    setSigningOut(true);
    console.log(typeof token)
    //@ts-ignore
    const response = await fetch(import.meta.env.VITE_LOG_OUT_URL, {
      method: "POST",
      body: JSON.stringify({ token: token() }),
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token()}`
      },
      credentials: 'same-origin'
    })
    const signedOut = await response.json();
    console.log(signedOut)
    localStorage.removeItem("toke")
    setToken(null)
    navigate("/dreamfeed");
  }

  async function updateUser(e: SubmitEvent) {
    e.preventDefault()
    if (token()) {
      setUpdatingUserInfo(true)
      //@ts-ignore
      const username = e.target.username.value ? e.target.username.value : currentUserInfo.username;
      //@ts-ignore
      const full_name = e.target.full_name.value ? e.target.full_name.value : currentUserInfo.full_name;
      //@ts-ignore
      const response = await fetch(import.meta.env.VITE_USER_URL, {
        method: "PATCH",
        body: JSON.stringify({ user: { username, full_name } }),
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token()}`
        },
        credentials: 'same-origin'
      })
      const { data } = await response.json();
      console.log(data)
      localStorage.setItem("username", data.username)
      localStorage.setItem("fullname", data.full_name)
      setCurrentUserInfo("username", data.username)
      setCurrentUserInfo("fullname", data.full_name)
      setUpdatingUserInfo(false)
      console.log(currentUserInfo)
    } else {
      throw new Error("oops looks like you need to login again!")
    }
  }


  return (
    <Show when={!signingOut() && !updatingUserInfo()} fallback={<div>🙋</div>}>
      <div style={{ "display": "flex", "flex-direction": "column", "align-items": "center" }}>
        <form style={{ "display": "flex", "flex-direction": "column" }} onSubmit={updateUser}>
          <label for="username" style={{ "font-size": "18px" }}>Update username:</label>
          <input type="text" id="username" name="username" placeholder={currentUserInfo.username ? currentUserInfo.username : "usernamee"} />
          <label for="full_name" style={{ "font-size": "18px" }}>Update full name:</label>
          <textarea id="full_name" name="full_name" placeholder={currentUserInfo.fullname ? currentUserInfo.fullname : "full name"} />
          <button style={{ "margin-top": "8px", "border": "2px solid black", "background-color": "white", "font-size": "24px", "color": "black" }} type="submit">Update :D</button>
        </form>
        <button onClick={signOut} style={{ "margin-top": "8px", "border": "2px solid black", "background-color": "white", "font-size": "24px" }}>sign out</button>
      </div>
    </Show>


  )
};

export default Profile;
