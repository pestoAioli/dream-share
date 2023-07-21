import { Socket } from "phoenix";

export default function socket(topic: string) {
  let socket = new Socket("ws://localhost:4000/socket", { params: { token: 1 } })
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
