import moment from "moment";
import "../styles/dreams-list.css";
import { Component, For, Show, createSignal } from "solid-js";
import { useSocket } from "./socket-context-provider";

const DreamsList: Component = () => {
  const socketConnection = useSocket();
  const [dreams, setDreams] = createSignal<Dream[]>([]);

  if (socketConnection) {
    socketConnection.on("list_dreams", (payload: DreamsArray) => {
      payload.dreams.map((dream: Dream) => {
        setDreams((dreams) => {
          const checkForReAdd = dreams.filter((dreami: Dream) => dreami.id !== dream.id);
          return [...checkForReAdd, dream]
        })
        console.log(dreams())
      })
    })

    socketConnection.on("new_dream", (payload: Dream) => {
      setDreams(dreams => [...dreams, payload])
      console.log(dreams())
    })
  }
  return (
    <Show when={dreams()} fallback={<div style={{ "font-size": "36px", "margin-left": "4px" }}>🧐💬</div>}>
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

export default DreamsList;
