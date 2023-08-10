import moment from "moment";
import "../styles/dreams-list.css";
import { Component, For, Match, Show, Switch, createEffect, createSignal } from "solid-js";
import { useSocket } from "./socket-context-provider";
import { useAuth, useStore } from "./auth-context-provider";



const MyDreams: Component = () => {
  const socketConnection = useSocket();
  const [currentUserInfo, _setCurrentUserInfo] = useStore();
  const [token, _setToken] = useAuth();
  const [dreams, setDreams] = createSignal<Dream[]>([]);
  const [dreamToEdit, setDreamToEdit] = createSignal<number>();
  if (socketConnection) {
    socketConnection.push("joined_my_feed", { user_id: currentUserInfo.user_id })
    socketConnection.on("list_my_dreams", (payload: DreamsArray) => {
      payload.dreams.map((dream: Dream) => {
        setDreams(dreams => {
          return [...dreams, dream].sort((a, b) => a.id - b.id);
        })
      })
    })
    socketConnection.on("new_dream", (dream: Dream) => {
      if (dream.user_id == currentUserInfo.user_id) {
        setDreams(dreams => [...dreams, dream].sort((a, b) => a.id - b.id))
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
        },
        credentials: 'same-origin'

      })
      const { data } = await response.json();
      setDreams((dreams) => {
        const updatedDreamsList = dreams.map(dream => {
          if (dream.id === data.id) {
            dream.dream = data.dream;
          }
          return dream;
        }).sort((a, b) => a.id - b.id)
        return updatedDreamsList;
      })
      // if (socketConnection) {
      //   socketConnection.push("updated_dream", { data })
      // }
      setDreamToEdit(undefined)
    } catch (e) {
      throw new Error("oopsie something went wrong uWu")
    }
  }

  return (
    <Show when={token()} fallback={<>Must be logged in to see this page :P</>}>
      <Show when={dreams().length > 0} fallback={<>Loading🧐💬 </>}>
        <div class="dreams-list">
          <For each={dreams()}>
            {(dream) => (
              <div class="dream-bubble">
                <div class="username">
                  {moment(dream.timestamp).subtract(7, 'hours').format('MMMM Do YYYY, h:mm a')}
                  <br /><i>Last night, I dreamt</i>:
                </div>
                <Switch>
                  <Match when={dreamToEdit() === dream.id}>
                    <form onSubmit={updateDream}>
                      <textarea name="dream" id={`${dream.id}`}>{dream.dream}</textarea>
                      <div style={{ "display": "flex" }}>
                        <button type="submit" style={{ "margin-bottom": "1px", "margin-left": "1px", "border": "1px solid black", "border-radius": "6px", "background-color": "peachpuff", "color": "black" }}><b>Submit</b></button>
                        <button onClick={() => setDreamToEdit(undefined)} style={{ "margin-bottom": "1px", "margin-left": "2px", "border": "1px solid black", "border-radius": "6px", "background-color": "peachpuff", "color": "black" }}><b>Cancel</b></button>
                      </div>

                    </form>
                  </Match>
                  <Match when={dreamToEdit() !== dream.id}>
                    <p class="dream-content">{dream.dream}</p>
                    <button onClick={() => setDreamToEdit(dream.id)} style={{ "margin-bottom": "1px", "margin-left": "1px", "border": "1px solid black", "border-radius": "6px", "background-color": "peachpuff" }}><b>Edit</b></button>
                  </Match>
                </Switch>
              </div>
            )}
          </For>
        </div>
      </Show>
    </Show>
  )
}

export default MyDreams;
