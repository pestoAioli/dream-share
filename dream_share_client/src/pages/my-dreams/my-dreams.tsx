import moment from "moment";
import "../../styles/dreams-list.css";
import { Component, For, Match, Show, Switch, createEffect, createSignal } from "solid-js";
import { useSocket } from "../../contexts/socket-context-provider";
import { useAuth, useStore } from "../../contexts/auth-context-provider";
import { A } from "@solidjs/router";
import RickyButton from "../../components/button";



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
          <div style={{
            "display": "flex",
            "justify-content": "space-around",
            "align-items": "center"
          }}>
            <div class="loading-hort" />
          </div>
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
                      <RickyButton on_click={() => deleteDream(dream.id)} bg_color="palegoldenrod">yes</RickyButton>
                      <RickyButton on_click={() => setAreYouSure(undefined)} bg_color="palevioletred">cancel</RickyButton>
                    </div>
                  </Show>
                  <Switch>
                    <Match when={dreamToEdit() === dream.id}>
                      <form onSubmit={updateDream}>
                        <textarea name="dream" id={`${dream.id}`}>{dream.dream}</textarea>
                        <div style={{ "display": "flex" }}>
                          <RickyButton margin_top="1px" margin_left="1px" bg_color="palegoldenrod" type="submit" >
                            <b>Submit</b>
                          </RickyButton>
                          <RickyButton on_click={() => setDreamToEdit(undefined)} margin_top="1px" margin_left="1px" bg_color="palevioletred">
                            <b>Cancel</b></RickyButton>
                        </div>

                      </form>
                    </Match>
                    <Match when={dreamToEdit() !== dream.id}>
                      <p class="dream-content">{dream.dream}</p>
                      <RickyButton margin_top="1px" margin_left="1px" bg_color="palegoldenrod" on_click={() => setDreamToEdit(dream.id)}>
                        <b>Edit</b>
                      </RickyButton>
                      <RickyButton on_click={() => setAreYouSure(dream.id)} margin_top="1px" margin_left="1px" bg_color="palevioletred">
                        <b>Delete</b>
                      </RickyButton>
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
