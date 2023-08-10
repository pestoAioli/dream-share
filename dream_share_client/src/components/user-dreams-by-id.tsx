import { useParams } from "@solidjs/router";
import { createSignal, For, Show, Switch } from "solid-js";
import type { Component } from "solid-js";
import { useSocket } from "./socket-context-provider";
import moment from "moment";

const UserDreamsById: Component = () => {
  const params = useParams();
  const socketConnection = useSocket();
  const [dreams, setDreams] = createSignal<Dream[]>([]);
  if (socketConnection) {
    socketConnection.push("get_dreams_by_user_id", { user_id: params.id })
    socketConnection.on("list_user_dreams", (payload: DreamsArray) => {
      payload.dreams.map((dream: Dream) => {
        setDreams(dreams => {
          return [...dreams, dream].sort((a, b) => a.id - b.id);
        })

      })
    })
  }
  return (
    <Show when={dreams().length > 0} fallback={<>Loading🧐💬</>}>
      <div class="dreams-list">
        <For each={dreams()}>
          {(dream) => (
            <div class="dream-bubble">
              <div class="username">
                {moment(dream.timestamp).subtract(7, 'hours').format('MMMM Do YYYY, h:mm a')}
                <br /><i>Last night, {dream.username} dreamt</i>:
              </div>
              <p class="dream-content">{dream.dream}</p>
            </div>
          )}
        </For>
      </div >
    </Show >

  )
}

export default UserDreamsById;
