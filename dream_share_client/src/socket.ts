import { Socket } from "phoenix";

export default function socket(topic: string) {
  //@ts-ignore
  let socket = new Socket(import.meta.env.SOCKET_URL, { params: { token: 1 } })
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

  // channel.on("new_dream", (payload) => {
  //   console.log(payload)
  // })
  return channel;
}
