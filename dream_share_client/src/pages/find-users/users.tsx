import type { Component } from "solid-js";
import { SocketContextProvider } from "../../contexts/socket-context-provider";
import FindUsers from "./find-users";

const Users: Component = () => {
  return (
    <SocketContextProvider>
      <FindUsers />
    </SocketContextProvider>
  )
}

export default Users;
