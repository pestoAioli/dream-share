import type { Component } from "solid-js";
import { Show, createSignal } from "solid-js";
import { useAuth } from "../components/auth-context-provider";
import { useNavigate } from "@solidjs/router";

const NewDream: Component = () => {
  const [token, _setToken] = useAuth();
  const [addingDream, setAddingDream] = createSignal(false);
  const navigate = useNavigate();
  async function addDream(e: SubmitEvent) {
    e.preventDefault();
    setAddingDream(true)
    try {
      //@ts-ignore
      const dream = e.target.dream.value;
      //@ts-ignore
      const response = await fetch(import.meta.env.VITE_DREAMS_URL, {
        method: "POST",
        body: JSON.stringify({ dream: { dream } }),
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token()}`
        },
        credentials: 'same-origin'
      })
      const result = await response.json();
      console.log(result)
      navigate("/dreamfeed")
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <div class="dreams-list">
      <Show when={token()}>
        <Show when={!addingDream()}>
          <div class="dream-bubble">
            <form onSubmit={addDream} style={{ "display": "flex", "flex-direction": "column" }} >
              <label class="username" for="dream" style={{ "font-size": "18px" }}>Last night I dreamt...</label>
              <textarea style={{ "min-height": "200px" }} id="dream" name="dream" placeholder="..." required />
              <button style={{ "border": "2px solid black", "background-color": "white", "font-size": "18px" }} type="submit">Submit</button>
            </form>
          </div >
        </Show>
        <Show when={addingDream()}>
          <p>Adding yuor dream...</p>
        </Show>
      </Show>
      <Show when={!token()}>
        <p style={{ "font-size": "18px" }}>Yuo gotta be logged in to post dream :/</p>
      </Show>
    </div>

  )
}

export default NewDream;
