import moment from "moment";
import "../styles/dreams-list.css";
import { Component, For, Show, createSignal } from "solid-js";
import { useSocket } from "./socket-context-provider";



const DreamsList: Component = () => {
  const socketConnection: any = useSocket();

  const [dreams, setDreams] = createSignal<any>([]);
  socketConnection.on("list_dreams", (payload: any) => {
    console.log(payload.dreams);
    payload.dreams.map((dream: any) => {
      setDreams(dreams => [...dreams, dream])
    })
  })

  socketConnection.on("new_dream", (payload: any) => {
    console.log(payload)
    setDreams(dreams => [...dreams, payload])
    console.log(dreams())
  })

  return (
    <Show when={dreams().length > 0} fallback={<div style={{ "font-size": "24px" }}>🧐💬</div>}>
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
