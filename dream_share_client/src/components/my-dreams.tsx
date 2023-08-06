import moment from "moment";
import "../styles/dreams-list.css";
import { Component, For, Show, createSignal } from "solid-js";
import { useSocket } from "./socket-context-provider";
import { useStore } from "./auth-context-provider";



const MyDreams: Component = () => {
  const socketConnection = useSocket();
  const [currentUserInfo, _setCurrentUserInfo] = useStore();
  const [dreams, setDreams] = createSignal<Dream[]>([]);
  if (socketConnection) {
    socketConnection.on("list_dreams", (payload: DreamsArray) => {
      console.log(payload.dreams);
      payload.dreams.map((dream: Dream) => {
        if (dream.user_id == currentUserInfo.user_id) {
          setDreams(dreams => {
            const checkForReAdd = dreams.filter((dreami: Dream) => dreami.id !== dream.id);
            return [...checkForReAdd, dream]
          })
        }
      })
    })
    socketConnection.on("new_dream", (dream: Dream) => {
      console.log(dream)
      if (dream.user_id == currentUserInfo.user_id) {
        setDreams(dreams => [...dreams, dream])
      }
      console.log(dreams())
    })
  }
  return (
    <Show when={dreams().length > 0} fallback={<>🧐💬 are yuo logged in? have you added any dreams?</>}>
      <div class="dreams-list">
        <For each={dreams()}>
          {(dream) => (
            <div class="dream-bubble">
              <div class="username">
                <strong style={{ "font-size": "18px" }}>{dream.username}</strong> ＠{moment(dream.timestamp).subtract(7, 'hours').format('MMMM Do YYYY, h:mm:ss a')}:
              </div>
              <p class="dream-content">{dream.dream}</p>
            </div>
          )}
        </For>
      </div>
    </Show>
  )
}

export default MyDreams;
