import "../../styles/dreams-list.css";
import { Component, Show } from "solid-js";
import { useSocket } from "../../contexts/socket-context-provider";
import { createStore } from "solid-js/store";
import DreamList from "../../components/dream-list";

const DreamsList: Component = () => {
  const socketConnection = useSocket();
  const [dreams, setDreams] = createStore<Dream[]>([]);
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
  }

  return (
    <Show when={dreams.length > 0} fallback={<div style={{ "font-size": "36px", "margin-left": "4px" }}><i>Loading...</i>🧐💬</div>}>
      <div class="dreams-list">
        <DreamList dreams={dreams} setDreams={setDreams} />
      </div >
    </Show >
  )
}

export default DreamsList;
