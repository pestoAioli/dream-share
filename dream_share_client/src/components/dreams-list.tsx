import moment from "moment";
import "../styles/dreams-list.css";
import { Component, For, Show, createEffect, createMemo, createResource, createSignal, onMount } from "solid-js";
import { useSocket } from "./socket-context-provider";

async function getDreams() {
  const response = await fetch("http://localhost:4000/dreams", {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
  const results = await response.json();
  // console.log(results)
  return results.data;
}

// let socketConnection: any;
// if (socketConnection) {
//   socketConnection.on("new_dream", (payload: any) => {
//     console.log(payload)
//   });
// }

const DreamsList: Component = () => {
  const socketConnection: any = useSocket();

  const [dreams, setDreams] = createSignal<any>();
  const [data] = createResource(getDreams);
  const dreamsMemo = createMemo(() => {
    if (!data.loading && !data.error) {
      setDreams(() => data());
    }
  })

  socketConnection.on("new_dream", (payload: any) => {
    console.log(payload)
    setDreams(dreams => [...dreams, payload])
    console.log(dreams())
  })

  return (
    <Show when={!data.loading && dreams().length > 0} fallback={<>🧐💬</>}>
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
