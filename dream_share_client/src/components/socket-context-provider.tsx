import { createContext, useContext } from "solid-js";
import socket from '../socket';

const SocketContext = createContext();

export function SocketContextProvider(props: any) {
  const socketConnection = socket("dreams:lobby");
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
