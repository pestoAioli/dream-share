import type { Component } from "solid-js";
import '../styles/login-form.css';
import { SocketContextProvider } from "../components/socket-context-provider";
import UserDreamsById from "../components/user-dreams-by-id";

const UserDreams: Component = () => {
  return (
    <SocketContextProvider>
      <UserDreamsById />
    </SocketContextProvider>
  );
}

export default UserDreams;
