import { createContext, useContext } from "solid-js";
import socket from '../socket';

const SocketContext = createContext();

export function SocketContextProvider(props: any) {
  //@ts-ignore
  const socketConnection = socket(import.meta.env.SOCKET_TOPIC);
  console.log(socketConnection);

  return (
    <SocketContext.Provider value={socketConnection}>
      {props.children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext);
}
