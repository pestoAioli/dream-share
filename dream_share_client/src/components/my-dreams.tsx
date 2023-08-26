import moment from "moment";
import "../styles/dreams-list.css";
import { Component, For, Match, Show, Switch, createEffect, createSignal } from "solid-js";
import { useSocket } from "./socket-context-provider";
import { useAuth, useStore } from "./auth-context-provider";
import { A } from "@solidjs/router";



const MyDreams: Component = () => {
  const socketConnection = useSocket();
  const [currentUserInfo, _setCurrentUserInfo] = useStore();
  const [token, _setToken] = useAuth();
  const [dreams, setDreams] = createSignal<Dream[]>([]);
  const [noDreamsYet, setNoDreamsYet] = createSignal(false);
  const [dreamToEdit, setDreamToEdit] = createSignal<number>();
  const [error, setError] = createSignal(false);
  const [areYouSure, setAreYouSure] = createSignal();
  if (socketConnection) {
    socketConnection.push("joined_my_feed", { user_id: localStorage.getItem("id") })
    socketConnection.on("list_my_dreams", (payload: DreamsArray) => {
      if (payload.dreams.length === 0) {
        setNoDreamsYet(true);
      }
      payload.dreams.map((dream: Dream) => {
        setDreams(dreams => {
          return [...dreams, dream].sort((a, b) => b.id - a.id);
        })
      })
    })
    socketConnection.on("new_dream", (dream: Dream) => {
      setNoDreamsYet(false);
      if (dream.user_id == currentUserInfo.user_id) {
        setDreams(dreams => [...dreams, dream].sort((a, b) => b.id - a.id))
      }
    })
  }
  createEffect(() => {
    let el = document.getElementById(`${dreamToEdit()}`)
    if (el && el.parentElement) {
      let actualHeight = el.scrollHeight.toString() + "px"
      let width = (el.parentElement.clientWidth - 12).toString() + "px"
      el.style.minHeight = actualHeight;
      el.style.minWidth = width;
    }
  }, [dreamToEdit])

  async function updateDream(e: SubmitEvent) {
    e.preventDefault();
    const target = e.target as HTMLInputElementEditDream;
    const dream = target.dream.value;
    try {
      const response = await fetch(import.meta.env.VITE_DREAMS_URL + `/${dreamToEdit()}`, {
        method: "PATCH",
        body: JSON.stringify({ dream: { dream } }),
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token()}`
        }

      })
      const { data } = await response.json();
      setDreams((dreams) => {
        const updatedDreamsList = dreams.map(dream => {
          if (dream.id === data.id) {
            dream.dream = data.dream;
          }
          return dream;
        }).sort((a, b) => b.id - a.id)
        return updatedDreamsList;
      })
      setDreamToEdit(undefined)
    } catch (e) {
      setError(true)
    }
  }

  async function deleteDream(dreamId: number) {
    try {
      const response = await fetch(`${import.meta.env.VITE_DREAMS_URL}/${dreamId}`, {
        method: "DELETE",
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token()}`
        }
      })
      setDreams((dreams) => {
        const updatedDreamsList = dreams.filter(dream => dream.id !== dreamId).sort((a, b) => b.id - a.id)
        if (updatedDreamsList.length == 0) {
          setNoDreamsYet(true)
        }
        return updatedDreamsList;
      });
      const result = await response.json();
    } catch (e) {
      setError(true)
    }
  }

  return (
    <Show when={token()} fallback={<>Must be logged in to see this page :P</>}>
      <Switch>
        <Match when={error()}>
          <p>something went wrong :/ please <button style={{ "text-decoration": "underline" }} onClick={() => {
            setError(false)
            setDreamToEdit(undefined)
          }}><b>refresh</b></button> and try again, and make sure you're logged in</p>
        </Match>
        <Match when={dreams().length == 0 && !error() && noDreamsYet() === false}>
          <>Loading...🧐</>
        </Match>
        <Match when={noDreamsYet() && !error()}>
          <h1> You gotta <A href="/newdream">write some dreams down</A> to see them here!</h1>
        </Match>
        <Match when={dreams().length > 0}>
          <div class="dreams-list">
            <For each={dreams()}>
              {(dream) => (
                <div class="dream-bubble">
                  <div class="username">
                    {moment(dream.timestamp).subtract(7, 'hours').format('MMMM Do YYYY, h:mm a')}
                    <br /><i>Last night, I dreamt</i>:
                  </div>
                  <Show when={areYouSure() == dream.id}>
                    <div class="are_you_sure">
                      <h3>are you sure you want to delete?</h3>
                      <button onClick={() => deleteDream(dream.id)} style={{
                        "border": "1px solid black", "border-radius": "6px",
                        "background-color": "palegreen", "color": "black"
                      }}>yes</button>
                      <button onClick={() => setAreYouSure(undefined)} style={{
                        "border": "1px solid black", "border-radius": "6px",
                        "background-color": "palevioletred", "color": "black"
                      }}>cancel</button>
                    </div>
                  </Show>
                  <Switch>
                    <Match when={dreamToEdit() === dream.id}>
                      <form onSubmit={updateDream}>
                        <textarea name="dream" id={`${dream.id}`}>{dream.dream}</textarea>
                        <div style={{ "display": "flex" }}>
                          <button type="submit" style={{
                            "margin-bottom": "1px", "margin-left": "1px", "border": "1px solid black", "border-radius": "6px",
                            "background-color": "peachpuff", "color": "black"
                          }}>
                            <b>Submit</b></button>
                          <button onClick={() => setDreamToEdit(undefined)}
                            style={{
                              "margin-bottom": "1px", "margin-left": "2px", "border": "1px solid black",
                              "border-radius": "6px", "background-color": "peachpuff", "color": "black"
                            }}>
                            <b>Cancel</b></button>
                        </div>

                      </form>
                    </Match>
                    <Match when={dreamToEdit() !== dream.id}>
                      <p class="dream-content">{dream.dream}</p>
                      <button onClick={() => setDreamToEdit(dream.id)}
                        style={{
                          "margin-bottom": "1px", "margin-left": "1px", "border": "1px solid black", "border-radius": "6px", "background-color": "peachpuff"
                        }}>
                        <b>Edit</b></button>
                      <button onClick={() => setAreYouSure(dream.id)} style={{
                        "margin-bottom": "1px", "margin-left": "1px", "border": "1px solid black", "border-radius": "6px", "background-color": "palevioletred"
                      }}><b>Delete</b></button>
                    </Match>
                  </Switch>
                </div>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </Show>
  )
}

export default MyDreams;
