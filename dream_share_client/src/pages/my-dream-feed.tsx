import type { Component } from "solid-js";
import '../styles/login-form.css';
import DreamsList from "../components/dreams-list";
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
