import type { Component } from "solid-js";
import { SocketContextProvider } from "../components/socket-context-provider";
import FindUsers from "../components/find-users";

const Users: Component = () => {
  return (
    <SocketContextProvider>
      <FindUsers />
    </SocketContextProvider>
  )
}

export default Users;
