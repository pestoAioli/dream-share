import type { Component } from "solid-js";
import '../styles/login-form.css';
import { SocketContextProvider } from "../components/socket-context-provider";
import MyDreams from "../components/my-dreams";

const MyDreamFeed: Component = () => {
  return (
    <SocketContextProvider>
      <MyDreams />
    </SocketContextProvider>
  );
}

export default MyDreamFeed;
