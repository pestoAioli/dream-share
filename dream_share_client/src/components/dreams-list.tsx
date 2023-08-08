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
  }
  return (
    <Show when={dreams().length > 0} fallback={<div style={{ "font-size": "36px", "margin-left": "4px" }}><i>Loading...</i>🧐💬</div>}>
      <div class="dreams-list">
        <For each={dreams()}>
          {(dream) => (
            <div class="dream-bubble">
              <div class="username">
                {moment(dream.timestamp).subtract(7, 'hours').format('MMMM Do YYYY, h:mm a')}
                <br /><i>Last night, <strong style={{ "font-size": "18px" }}> {dream.username}</strong> dreamt</i>:
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
