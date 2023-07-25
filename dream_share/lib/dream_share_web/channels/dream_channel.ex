defmodule DreamShareWeb.DreamChannel do
  use Phoenix.Channel

  def join("dreams:main", _message, socket) do
    {:ok, socket}
  end

  def join("dreams:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_info({:dream_created, dream}, socket) do
    push(socket, "new_dream", %{
      id: dream.id,
      content: dream.content,
      username: dream.username,
      timestamp: dream.inserted_at
    })

    IO.inspect(dream)
    {:noreply, socket}
  end

  def handle_info({:dream_updated, dream}, socket) do
    IO.inspect(dream)
    {:noreply, socket}
  end
end
