import moment from "moment";
import "../styles/dreams-list.css";
import { Component, For, Show, createSignal } from "solid-js";
import { useSocket } from "./socket-context-provider";
import { useAuth } from "./auth-context-provider";
import { createStore } from "solid-js/store";

const DreamsList: Component = () => {
  const socketConnection = useSocket();
  const [dreams, setDreams] = createStore<Dream[]>([]);
  const [leavingComment, setLeavingComment] = createSignal();
  const [submittingComment, setSubmittingComment] = createSignal(false);
  const [token, _] = useAuth();
  if (socketConnection) {
    socketConnection.push("joined_main_feed", {});
    socketConnection.on("list_dreams", (payload: DreamsArray) => {
      console.log(payload)
      payload.dreams.map((dream: Dream) => {
        setDreams((dreams) => {
          const checkForReAdd = dreams.filter((dreami: Dream) => dreami.id !== dream.id);
          return [...checkForReAdd, dream].sort((a, b) => a.id - b.id)
        })
      })
    })

    socketConnection.on("new_dream", (dream: Dream) => {
      setDreams(dreams => [...dreams, dream].sort((a, b) => a.id - b.id))
    })
    socketConnection.on("updated_dream", (dream: Dream) => {
      setDreams((dreams) => {
        const updatedDreamsList = dreams.map(dreami => {
          if (dreami.id === dream.id) {
            dreami = dream;
          }
          return dreami;
        }).sort((a, b) => a.id - b.id)
        return updatedDreamsList;
      })

    })
    socketConnection.on("new_comment", (comment) => {
      setDreams((dreams) => {
        const updatedDreamsList = dreams.map(dream => {
          if (dream.id == comment.dream_id) {
            console.log(comment, dream)
            dream.comments.push(comment)
          }
          return dream;
        }).sort((a, b) => a.id - b.id)
        return updatedDreamsList;
      })
    })
  }

  async function addComment(e: SubmitEvent) {
    e.preventDefault();
    if (!token()) {
      alert("please login to leave a comment :)")
      return;
    }
    setSubmittingComment(true)
    const target = e.target as HTMLInputElementComment;
    const body = target.comment.value;
    const dream_id = target.dream_id.value;
    const response = await fetch(import.meta.env.VITE_COMMENTS_URL, {
      method: "POST",
      body: JSON.stringify({ comment: { body, dream_id } }),
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token()}`
      }
    })
    const result = await response.json();
    console.log(result)
    setSubmittingComment(false)
  }

  return (
    <Show when={dreams.length > 0} fallback={<div style={{ "font-size": "36px", "margin-left": "4px" }}><i>Loading...</i>🧐💬</div>}>
      <div class="dreams-list">
        <For each={dreams}>
          {(dream) => (
            <div class="dream-bubble">
              <div class="username">
                {moment(dream.timestamp).subtract(7, 'hours').format('MMMM Do YYYY, h:mm a')}
                <br /><i>Last night, <strong style={{ "font-size": "18px" }}> {dream.username}</strong> dreamt</i>:
              </div>
              <p class="dream-content">{dream.dream}</p>
              <div style={{ "display": "flex", "flex-direction": "row-reverse" }}>
                <button onClick={() => {
                  if (leavingComment() == dream.id) {
                    setLeavingComment(undefined)
                  } else {
                    setLeavingComment(dream.id)
                  }
                }} classList={{ show: leavingComment() == dream.id, closed: leavingComment() != dream.id }}>{dream.comments.length} 💬</button>
              </div>
              <Show when={leavingComment() == dream.id}>
                <For each={dream.comments}>
                  {(comment) => (
                    <div style={{ "display": "flex", "align-items": "center", "padding-bottom": "6px" }}>
                      <b style={{ "font-size": "18px", "margin-right": "2px" }}>{comment.username}:</b>
                      <p style={{ "margin-top": "0px", "margin-bottom": "0px" }}> {comment.body}</p>
                    </div>
                  )}
                </For>
                <form onSubmit={addComment} style={{ "display": "flex" }}>
                  <textarea id="comment" name="comment" placeholder="leave comment..." />
                  <input type="hidden" name="dream_id" id="dream_id" value={dream.id} />
                  <button type="submit" style={{
                    "border": "1px solid black", "border-radius": "6px",
                    "background-color": "palegoldenrod", "color": "black", "align-self": "end"
                  }}>
                    <Show when={!submittingComment()}>send</Show>
                    <Show when={submittingComment()}>sending...</Show>
                  </button>
                </form>
              </Show>
            </div>
          )}
        </For>
      </div >
    </Show >
  )
}

export default DreamsList;
