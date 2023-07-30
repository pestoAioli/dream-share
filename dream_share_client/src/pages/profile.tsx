import { useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";
import { Show, createSignal } from "solid-js";

const Profile: Component = () => {
  const [signingOut, setSigningOut] = createSignal(false);
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

  }
  return (
    <Show when={!signingOut()} fallback={<div>🙋</div>}>
      <div style={{ "display": "flex", "flex-direction": "column", "align-items": "center" }}>
        <form style={{ "display": "flex", "flex-direction": "column" }}>
          <label for="username" style={{ "font-size": "18px" }}>Update username:</label>
          <input type="text" id="username" name="username" placeholder="usernamee" />
          <label for="about" style={{ "font-size": "18px" }}>Update bio:</label>
          <textarea id="about" name="about" placeholder="about me" />
          <button style={{ "margin-top": "8px", "border": "2px solid black", "background-color": "white", "font-size": "24px" }} onSubmit={updateUser}>Update :D</button>
        </form>
      </div>
    </Show>
  )
};

export default Profile;
