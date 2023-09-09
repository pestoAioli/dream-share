import type { Component } from "solid-js";
import { For, Show, createSignal } from "solid-js";
import { useSocket } from "../../contexts/socket-context-provider";
import { A } from "@solidjs/router";
import RickyButton from "../../components/button";

const FindUsers: Component = () => {
  const [usersFound, setUsersFound] = createSignal<{ full_name: string, id: number, username: string }[]>([]);
  const socketConnection = useSocket();

  if (socketConnection) {
    socketConnection.push("get_all_users", {});
    socketConnection.on("found_all_users", (users) => {
      console.log(users)
      setUsersFound(users.users)
    })
  }

  // function findUser(e: SubmitEvent) {
  //   e.preventDefault()
  //   setUsersFound([])
  //   setNoUserFound(false)
  //   setFinding(true)
  //   const target = e.target as HTMLInputElementFindUser;
  //   let username = target.user_search.value.toLowerCase();
  //   if (socketConnection) {
  //     socketConnection.push("find_user", { username })
  //     username = ''
  //   }
  // }
  // <form onSubmit={findUser} class="general-list-left" style={{ "margin-top": "8px" }}>
  //      <label for="user_search">Search for someone by their username:</label>
  //     <input type="text" id="user_search" name="user_search" placeholder="type name here" required />
  //      <RickyButton type="submit" margin_top="8px" bg_color="aliceblue" font_size="24px">
  //        {finding() ? 'Searching...' : 'Search'}
  //      </RickyButton>
  //   </form>

  return (
    <div class="general-list">
      <Show when={usersFound().length > 0} fallback={<>Loading...</>}>
        <div class="users-list">
          <For each={usersFound()}>
            {(user) => (
              <div class="dream-bubble">
                <div class="username">
                  <b style={{ "font-size": "24px" }}>{user.username}</b>
                </div>
                <p>Full name: {user.full_name}</p>
                <div style={{ "margin-bottom": "4px" }}>
                  <A href={`/user/${user.id}`} style={{
                    "text-decoration": "none",
                    "margin-top": "8px",
                    "margin-left": "2px",
                    "margin-right": "2px",
                    "border": "2px solid black",
                    "border-radius": "6px",
                    "background-color": "palegoldenrod",
                    "font-size": "24px",
                    "color": "black"
                  }}>Read their dreams</A>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default FindUsers;
