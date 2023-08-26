import type { Component } from "solid-js";
import DreamsList from "./dreams-list";
import { SocketContextProvider } from "../../contexts/socket-context-provider";

const DreamFeed: Component = () => {
  return (
    <SocketContextProvider>
      <DreamsList />
    </SocketContextProvider>
  );
}

export default DreamFeed;
