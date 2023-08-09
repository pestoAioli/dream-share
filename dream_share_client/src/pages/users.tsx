import type { Component } from "solid-js";
import { SocketContextProvider } from "../components/socket-context-provider";
import FindUsers from "../components/find-users";
import socket from "../socket";

const Users: Component = () => {
  return (
    <SocketContextProvider>
      <FindUsers />
    </SocketContextProvider>
  )
}

export default Users;
