import { Channel, Socket } from "phoenix";

export default function socket(topic: string): Channel {
  let socket = new Socket(import.meta.env.VITE_SOCKET_URL, { params: { token: 1 } })
  socket.connect();
  let channel = socket.channel(topic, {});
  channel
    .join()
    .receive('ok', (response) => {
      console.log('joined', response)
    })
    .receive('error', (response) => {
      console.log('no joined', response)
    })
  return channel;
}
