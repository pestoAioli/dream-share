defmodule DreamShareWeb.DreamsChannel do
  use DreamShareWeb, :channel

  # alias DreamShare.Dreams.Dream

  @impl true
  def join("dreams:lobby", _payload, socket) do
    # send(Kernel.self(), :after_join)
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
      user_id: dream.user_id,
      updated: dream.updated_at,
      comments: []
    })

    IO.inspect(dream)
    {:noreply, socket}
  end

  @impl true
  def handle_info({:comment_created, comment}, socket) do
    push(socket, "new_comment", %{
      id: comment.id,
      body: comment.body,
      username: comment.username,
      dream_id: comment.dream_id,
      user_id: comment.user_id,
      timestamp: comment.inserted_at,
      updated: comment.updated_at
    })

    {:noreply, socket}
  end

  @impl true
  def handle_info({:comment_deleted, comment}, socket) do
    push(socket, "comment_deleted", %{
      id: comment.id,
      dream_id: comment.dream_id,
      user_id: comment.user_id,
      timestamp: comment.inserted_at
    })

    {:noreply, socket}
  end

  @impl true
  def handle_info({:dream_updated, dream}, socket) do
    IO.inspect(dream)

    push(socket, "updated_dream", %{
      id: dream.id,
      dream: dream.dream,
      username: dream.username,
      timestamp: dream.inserted_at,
      user_id: dream.user_id,
      updated: dream.updated_at,
      comments:
        Enum.map(DreamShare.Dreams.get_comments_by_dream_id(dream.id), fn comment ->
          %{
            id: comment.id,
            body: comment.body,
            username: comment.username,
            dream_id: comment.dream_id,
            user_id: comment.user_id,
            timestamp: comment.inserted_at,
            updated: comment.updated_at
          }
        end)
    })

    {:noreply, socket}
  end

  @impl true
  def handle_info({:dream_deleted, dream}, socket) do
    push(socket, "dream_deleted", %{
      id: dream.id,
      username: dream.username,
      user_id: dream.user_id
    })
  end

  @impl true
  def handle_in("joined_main_feed", _payload, socket) do
    dreams =
      DreamShare.Dreams.list_dreams()
      |> dream_mapper()

    push(socket, "list_dreams", %{dreams: dreams})
    {:noreply, socket}
  end

  @impl true
  def handle_in("joined_my_feed", payload, socket) do
    {id, _} = Integer.parse(payload["user_id"])
    IO.inspect(id)

    dreams =
      DreamShare.Dreams.get_dreams_by_user_id(id)
      |> dream_mapper()

    push(socket, "list_my_dreams", %{dreams: dreams})
    {:noreply, socket}
  end

  @impl true
  def handle_in("get_all_users", _payload, socket) do
    users =
      DreamShare.Accounts.get_all_users()
      |> Enum.map(fn user ->
        %{
          id: user.id,
          username: user.username,
          full_name: user.full_name
        }
      end)

    push(socket, "found_all_users", %{users: users})

    IO.inspect(users)
    {:noreply, socket}
  end

  def handle_in("get_dreams_by_user_id", payload, socket) do
    {id, _} = Integer.parse(payload["user_id"])

    dreams =
      DreamShare.Dreams.get_dreams_by_user_id(id)
      |> dream_mapper()

    IO.inspect(dreams)
    push(socket, "list_user_dreams", %{dreams: dreams})
    {:noreply, socket}
  end

  def handle_in("search_dreams_by_keyword", keyword, socket) do
    IO.inspect(keyword)

    dreams =
      DreamShare.Dreams.get_dreams_by_keyword(keyword["keyword"])
      |> dream_mapper()

    IO.inspect(dreams)
    push(socket, "dreams_found_by_keyword", %{dreams: dreams})

    {:noreply, socket}
  end

  defp dream_mapper(dreams) do
    dreams
    |> Enum.map(fn dream ->
      %{
        id: dream.id,
        dream: dream.dream,
        username: dream.username,
        timestamp: dream.inserted_at,
        user_id: dream.user_id,
        updated: dream.updated_at,
        comments:
          Enum.map(DreamShare.Dreams.get_comments_by_dream_id(dream.id), fn comment ->
            %{
              id: comment.id,
              body: comment.body,
              username: comment.username,
              dream_id: comment.dream_id,
              user_id: comment.user_id,
              timestamp: comment.inserted_at,
              updated: comment.updated_at
            }
          end)
      }
    end)
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
