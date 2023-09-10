import moment from "moment";
import "../../styles/dreams-list.css";
import { Component, For, Show, createSignal } from "solid-js";
import { useSocket } from "../../contexts/socket-context-provider";
import { useAuth } from "../../contexts/auth-context-provider";
import { createStore } from "solid-js/store";
import RickyButton from "../../components/button";

const DreamsList: Component = () => {
  const socketConnection = useSocket();
  const [dreams, setDreams] = createStore<Dream[]>([]);
  const [leavingComment, setLeavingComment] = createSignal();
  const [submittingComment, setSubmittingComment] = createSignal(false);
  const [areYouSure, setAreYouSure] = createSignal();
  const [showDeleteCommentIcon, setShowDeleteCommentIcon] = createSignal();
  const [token, _] = useAuth();
  if (socketConnection) {
    socketConnection.push("joined_main_feed", {});
    socketConnection.on("list_dreams", (payload: DreamsArray) => {
      payload.dreams.map((dream: Dream) => {
        setDreams((dreams) => {
          const checkForReAdd = dreams.filter((dreami: Dream) => dreami.id !== dream.id);
          return [...checkForReAdd, dream].sort((a, b) => b.id - a.id)
        })
      })
    })

    socketConnection.on("new_dream", (dream: Dream) => {
      setDreams(dreams => [...dreams, dream].sort((a, b) => b.id - a.id))
    })
    socketConnection.on("updated_dream", (dream: Dream) => {
      setDreams((dreams) => {
        const updatedDreamsList = dreams.map(dreami => {
          if (dreami.id === dream.id) {
            dreami = dream;
          }
          return dreami;
        }).sort((a, b) => b.id - a.id)
        return updatedDreamsList;
      })

    })
    socketConnection.on("new_comment", (comment) => {
      setDreams(
        (dream) => dream.id == comment.dream_id,
        "comments",
        (comments) => {
          const filteredComments = comments.filter(commento => commento.id != comment.id)
          return [...filteredComments, comment]
        }
      )
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
    const { data } = await response.json();
    setSubmittingComment(false)
    setDreams(
      (dream) => dream.id == dream_id,
      "comments",
      (comments) => {
        const filteredComments = comments.filter(commento => commento.id != data.id)
        return [...filteredComments, data]
      }
    )
    target.comment.value = '';
  }

  function maybeShowDeleteIcon(user_id: number, comment_id: number) {
    if (token() && Number(localStorage.getItem("id")) === user_id) {
      setShowDeleteCommentIcon(comment_id)
    } else {
      return;
    }
  }
  async function deleteComment(comment_id: number, dream_id: number) {
    if (!token()) alert('gotta be logged in my boy')
    const response = await fetch(`${import.meta.env.VITE_COMMENTS_URL}/${comment_id}`, {
      method: "DELETE",
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token()}`
      }
    })
    setAreYouSure(undefined)
    setShowDeleteCommentIcon(undefined)
    setDreams(
      (dream) => dream.id == dream_id,
      "comments",
      (comments) => comments.filter(comment => comment.id != comment_id)
    )
  }

  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)

  return (
    <Show when={dreams.length > 0} fallback={<div style={{ "font-size": "36px", "margin-left": "4px" }}><i>Loading...</i>🧐💬</div>}>
      <div class="dreams-list">
        <For each={dreams}>
          {(dream) => (
            <div class="dream-bubble">
              <div class="username">
                {moment.utc(dream.timestamp).toDate().toLocaleString()}
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
                    <div onMouseOver={() => maybeShowDeleteIcon(comment.user_id, comment.id)}
                      classList={{ comment_hovered: showDeleteCommentIcon() == comment.id }} class="comment">
                      <Show when={areYouSure() == comment.id}>
                        <div class="are_you_sure">
                          <h3>are you sure you want to delete?</h3>
                          <RickyButton on_click={() => deleteComment(comment.id, comment.dream_id)} bg_color="palegoldenrod">yes</RickyButton>
                          <RickyButton on_click={() => setAreYouSure(undefined)} bg_color="palevioletred">cancel</RickyButton>
                        </div>
                      </Show>
                      <b style={{ "font-size": "18px", "margin-right": "2px" }}>{comment.username}:</b>
                      <p style={{ "margin-top": "0px", "margin-bottom": "0px" }}> {comment.body}</p>
                      <Show when={showDeleteCommentIcon() == comment.id}>
                        <button onClick={() => setAreYouSure(comment.id)} style={{ "margin-top": "0px", "margin-bottom": "0px", "font-size": "10px" }}>
                          ❌</button>
                      </Show>
                    </div>
                  )}
                </For>
                <form onSubmit={addComment} style={{ "display": "flex" }}>
                  <textarea id="comment" name="comment" placeholder="leave comment..." />
                  <input type="hidden" name="dream_id" id="dream_id" value={dream.id} />
                  <RickyButton type="submit" bg_color="palegoldenrod">
                    <Show when={!submittingComment()}>send</Show>
                    <Show when={submittingComment()}>sending...</Show>
                  </RickyButton>
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
