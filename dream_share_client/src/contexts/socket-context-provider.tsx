import { createContext, useContext } from "solid-js";
import socket from '../socket';
import { Channel } from "phoenix";

const SocketContext = createContext<Channel>();

export function SocketContextProvider(props: any) {
  const socketConnection = socket(import.meta.env.VITE_SOCKET_TOPIC);

  return (
    <SocketContext.Provider value={socketConnection}>
      {props.children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext);
}
