import type { Component } from "solid-js";
import { SocketContextProvider } from "../../contexts/socket-context-provider";
import UserDreamsById from "./user-dreams-by-id";

const UserDreams: Component = () => {
  return (
    <SocketContextProvider>
      <UserDreamsById />
    </SocketContextProvider>
  );
}

export default UserDreams;
