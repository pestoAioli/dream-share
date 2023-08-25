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
    const response = await fetch(import.meta.env.VITE_LOG_OUT_URL, {
      method: "POST",
      body: JSON.stringify({ token: token() }),
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token()}`
      }
    })
    const signedOut = await response.json();
    console.log(signedOut)
    localStorage.removeItem("toke")
    setToken(null)
    navigate("/dreams");
  }

  async function updateUser(e: SubmitEvent) {
    e.preventDefault()
    if (token()) {
      setUpdatingUserInfo(true)
      const target = e.target as HTMLInputElementUpdateUser;
      const username = target.username.value ? target.username.value : currentUserInfo.username;
      const full_name = target.full_name.value ? target.full_name.value : currentUserInfo.full_name;
      const response = await fetch(import.meta.env.VITE_USER_URL, {
        method: "PATCH",
        body: JSON.stringify({ user: { username, full_name } }),
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token()}`
        }
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
  //using any for now because bip is experimental/not fully supported
  let bip: any = null;
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    bip = e;
  })
  function triggerInstall() {
    if (bip) {
      bip.prompt();
    } else {
      //aka not chrome(gd safari...), already installed, etc
      alert("Click on the share icon in your browser bar, then look for 'add to home screen', if yuoure on desktop, please use chrome to install")
    }
  }



  return (
    <Show when={!signingOut() && !updatingUserInfo()} fallback={<div>🙋</div>}>
      <div class="general-list">
        <form class="general-list-left" onSubmit={updateUser}>
          <label for="username" style={{ "font-size": "18px" }}>Update username:</label>
          <input type="text" id="username" name="username" placeholder={currentUserInfo.username ? currentUserInfo.username : "usernamee"} />
          <label for="full_name" style={{ "font-size": "18px" }}>Update full name:</label>
          <textarea id="full_name" name="full_name" placeholder={currentUserInfo.fullname ? currentUserInfo.fullname : "full name"} />
          <button style={{ "margin-top": "8px", "border": "2px solid black", "border-radius": "6px", "background-color": "papayawhip", "font-size": "24px", "color": "black" }} type="submit">Update</button>
        </form>
        <button onClick={() => triggerInstall()} id='install'>install app</button>
        <button onClick={signOut} style={{ "margin-top": "8px", "border": "2px solid black", "border-radius": "6px", "background-color": "aliceblue", "font-size": "24px" }}>sign out</button>
      </div>
    </Show>


  )
};

export default Profile;
