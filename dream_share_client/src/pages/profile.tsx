import { useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";
import { Show, createSignal } from "solid-js";
import { useAuth, useStore } from "../components/auth-context-provider";

const Profile: Component = () => {
  const [signingOut, setSigningOut] = createSignal(false);
  const [isAuthenticated, setIsAuthenticated] = useAuth();
  const [currentUserInfo, setCurrentUserInfo] = useStore();
  const [updatingUserInfo, setUpdatingUserInfo] = createSignal(false);
  const navigate = useNavigate();
  // async function signOut() {
  //   setSigningOut(true);
  //   const token = JSON.stringify(localStorage.getItem("toke"));
  //   console.log(typeof token)
  //   const response = await fetch("http://localhost:4000/api/accounts/sign_out", {
  //     method: "GET",
  //     mode: 'cors',
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${token}`
  //     },
  //     credentials: 'same-origin'
  //   })
  //   const signedOut = await response.json();
  //   console.log(signedOut)
  //   localStorage.removeItem("toke")
  //   navigate("/dreamfeed");
  // }

  async function updateUser(e: SubmitEvent) {
    e.preventDefault()
    if (isAuthenticated()) {
      setUpdatingUserInfo(true)
      const token = isAuthenticated();
      //@ts-ignore
      const username = e.target.username.value;
      //@ts-ignore
      const full_name = e.target.full_name.value;
      const response = await fetch("http://localhost:4000/api/user/update", {
        method: "PATCH",
        body: JSON.stringify({ user: { username, full_name } }),
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'same-origin'
      })
      const { data } = await response.json();
      setCurrentUserInfo("username", data.user.username)
      setCurrentUserInfo("fullname", data.user.full_name)
    } else {
      throw new Error("oops looks like you need to login again!")
    }
  }
  return (
    <Show when={!signingOut()} fallback={<div>🙋</div>}>
      <div style={{ "display": "flex", "flex-direction": "column", "align-items": "center" }}>
        <form style={{ "display": "flex", "flex-direction": "column" }} onSubmit={updateUser}>
          <label for="username" style={{ "font-size": "18px" }}>Update username:</label>
          <input type="text" id="username" name="username" placeholder={currentUserInfo.username ? currentUserInfo.username : "usernamee"} />
          <label for="full_name" style={{ "font-size": "18px" }}>Update full name:</label>
          <textarea id="full_name" name="full_name" placeholder={currentUserInfo.fullname ? currentUserInfo.fullname : "full name"} />
          <button style={{ "margin-top": "8px", "border": "2px solid black", "background-color": "white", "font-size": "24px" }} type="submit">Update :D</button>
        </form>
      </div>
    </Show>
  )
};

export default Profile;
