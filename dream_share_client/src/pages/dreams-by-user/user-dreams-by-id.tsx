import { useParams } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import type { Component } from "solid-js";
import { useSocket } from "../../contexts/socket-context-provider";
import { createStore } from "solid-js/store";
import DreamList from "../../components/dream-list";

const UserDreamsById: Component = () => {
  const params = useParams();
  const socketConnection = useSocket();
  const [dreams, setDreams] = createStore<Dream[]>([]);
  const [noDreamsYet, setNoDreamsYet] = createSignal(false);
  if (socketConnection) {
    socketConnection.push("get_dreams_by_user_id", { user_id: params.id })
    socketConnection.on("list_user_dreams", (payload: DreamsArray) => {
      if (payload.dreams.length == 0) {
        setNoDreamsYet(true)
      }
      payload.dreams.map((dream: Dream) => {
        setDreams((dreams) => {
          const checkForReAdd = dreams.filter((dreami: Dream) => dreami.id !== dream.id);
          return [...checkForReAdd, dream].sort((a, b) => b.id - a.id)
        })
      })
    })
  }
  return (
    <>
      <Show when={noDreamsYet()}>
        <h1>dis user haz no dreams saved yet :/</h1>
      </Show>
      <Show when={dreams.length > 0 || noDreamsYet()}
        fallback={
          <div style={{
            "display": "flex",
            "justify-content": "space-around",
            "align-items": "center"
          }}>
            <div class="loading-hort" />
          </div>
        }>
        <div class="dreams-list">
          <DreamList dreams={dreams} setDreams={setDreams} />
        </div >
      </Show >
    </>
  )
}

export default UserDreamsById;
