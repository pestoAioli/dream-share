defmodule DreamShareWeb.DreamsChannel do
  use DreamShareWeb, :channel

  @impl true
  def join("dreams:lobby", _payload, socket) do
    send(Kernel.self(), :after_join)
    {:ok, socket}
  end

  def join("dreams" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  @impl true
  def handle_info({:dream_created, dream}, socket) do
    push(socket, "new_dream", %{
      id: dream.id,
      dream: dream.dream,
      username: dream.username,
      timestamp: dream.inserted_at,
      user_id: dream.user_id
    })

    IO.inspect(dream)
    {:noreply, socket}
  end

  @impl true
  def handle_info({:dream_updated, dream}, socket) do
    IO.inspect(dream)
    {:noreply, socket}
  end

  @impl true
  def handle_info(:after_join, socket) do
    dreams =
      DreamShare.Dreams.list_dreams()
      |> Enum.map(fn dream ->
        %{
          id: dream.id,
          dream: dream.dream,
          username: dream.username,
          timestamp: dream.inserted_at,
          user_id: dream.user_id
        }
      end)

    IO.inspect(dreams)
    push(socket, "list_dreams", %{dreams: dreams})
    {:noreply, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  # @impl true
  # def handle_in("ping", payload, socket) do
  #   {:reply, {:ok, payload}, socket}
  # end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (dreams:lobby).
  # @impl true
  # def handle_in("shout", payload, socket) do
  #   broadcast(socket, "shout", payload)
  #   {:noreply, socket}
  # end

  # Add authorization logic here as required.
  # defp authorized?(_payload) do
  # true
  # end
end