import type { Component } from "solid-js";
import { For, Show, createSignal } from "solid-js";
import { useSocket } from "./socket-context-provider";
import { A } from "@solidjs/router";
import { useStore } from "./auth-context-provider";

const FindUsers: Component = () => {
  const [usersFound, setUsersFound] = createSignal<{ full_name: string, id: number, username: string }[]>([]);
  const [finding, setFinding] = createSignal(false);
  const socketConnection = useSocket();

  if (socketConnection) {
    socketConnection.on("found_user", (user) => {
      setUsersFound([user])
      console.log(usersFound());
      setFinding(false)
    })
  }

  function findUser(e: SubmitEvent) {
    e.preventDefault()
    setFinding(true)
    const target = e.target as HTMLInputElementFindUser;
    let username = target.user_search.value;
    if (socketConnection) {
      console.log(socketConnection)
      socketConnection.push("find_user", { username })
      username = ''
    }
  }
  return (
    <div class="general-list">
      <form onSubmit={findUser} class="general-list-left" style={{ "margin-top": "8px" }}>
        <label for="user_search">Search for someone by their username:</label>
        <input type="text" id="user_search" name="user_search" placeholder="type name here" required />
        <button type="submit" style={{ "margin-top": "8px", "border": "2px solid black", "background-color": "paleturquoise", "font-size": "24px" }}>{finding() ? 'Searching...' : 'Search'}</button>
      </form>
      <Show when={usersFound().length > 0} fallback={<></>}>
        <div class="dreams-list">
          <For each={usersFound()}>
            {(user) => (
              <div class="dream-bubble">
                <div class="username">
                  <b style={{ "font-size": "24px" }}>{user.username}</b>
                </div>
                <p>Full name: {user.full_name}</p>
                <A href={`/user/${user.id}`} style={{ "margin-top": "8px", "border": "2px solid black", "border-radius": "6px", "background-color": "papayawhip", "font-size": "24px", "color": "black" }}>
                  Read their dreams</A>
              </div>
            )}
          </For>
        </div>
      </Show>

    </div>
  )
}

export default FindUsers;
