import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import '../styles/login-form.css';
import DreamsList from "../components/dreams-list";
import { SocketContextProvider } from "../components/socket-context-provider";

const DreamFeed: Component = (props: any) => {
  props.ref = "dreams:main"
  return (
    <SocketContextProvider>
      <DreamsList />
    </SocketContextProvider>
  );
}

export default DreamFeed;
