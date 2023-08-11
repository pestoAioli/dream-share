import type { Component } from "solid-js";
import { Match, Show, Switch, createSignal } from "solid-js";
import { useAuth } from "../components/auth-context-provider";
import { A, useNavigate } from "@solidjs/router";

const NewDream: Component = () => {
  const [token, _setToken] = useAuth();
  const [addingDream, setAddingDream] = createSignal(false);
  const [error, setError] = createSignal(false);
  const navigate = useNavigate();
  async function addDream(e: SubmitEvent) {
    e.preventDefault();
    setAddingDream(true)
    try {
      const target = e.target as HTMLInputElementAddDream;
      const dream = target.dream.value;
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
      navigate("/dreams")
    } catch (e) {
      setError(true)
    }
  }
  return (
    <div class="dreams-list">
      <Show when={token()}>
        <Switch>
          <Match when={!addingDream()}>
            <div class="dream-bubble">
              <form onSubmit={addDream} style={{ "display": "flex", "flex-direction": "column" }} >
                <label class="username" for="dream" style={{ "font-size": "18px" }}><i>Last night I dreamt...</i></label>
                <textarea style={{ "min-height": "200px" }} id="dream" name="dream" placeholder="..." required />
                <button style={{ "border": "2px solid black", "border-radius": "6px", "background-color": "peachpuff", "font-size": "18px", "color": "black" }} type="submit">Submit</button>
              </form>
            </div >
          </Match>
          <Match when={addingDream() && error()}>
            <p>something went wrong :/ please <button style={{ "text-decoration": "underline" }} onClick={() => {
              setError(false)
              setAddingDream(false)
            }}><b>refresh</b></button> and try again, and make sure you're logged in</p>
          </Match>
          <Match when={addingDream()}>
            <p>Adding yuor dream...</p>
          </Match>
        </Switch>
      </Show>
      <Show when={!token()}>
        <p style={{ "font-size": "18px" }}>Yuo gotta be logged in to post dream :/</p>
        <p style={{ "font-size": "18px" }}><A href="/login" >Login now</A></p>
      </Show>
    </div>

  )
}

export default NewDream;
