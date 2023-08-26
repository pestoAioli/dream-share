import type { Component } from "solid-js";
import { SocketContextProvider } from "../../contexts/socket-context-provider";
import MyDreams from "./my-dreams";

const MyDreamFeed: Component = () => {
  return (
    <SocketContextProvider>
      <MyDreams />
    </SocketContextProvider>
  );
}

export default MyDreamFeed;
