import type { Component } from "solid-js";
import { useSocket } from "./socket-context-provider";

const FindUsers: Component = () => {
  const socketConnection = useSocket();
  if (socketConnection) {
    socketConnection.on("found_user", (user) => {

    })
  }
  return (
    <h1>hi</h1>
  )
}

export default FindUsers;
