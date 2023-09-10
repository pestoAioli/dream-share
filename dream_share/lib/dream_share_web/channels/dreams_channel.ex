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
  def handle_in("joined_main_feed", _payload, socket) do
    dreams =
      DreamShare.Dreams.list_dreams()
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

    # comments =
    #   DreamShare.Dreams.list_comments()
    #   |> Enum.map(fn comment ->
    #     %{
    #       id: comment.id,
    #       body: comment.body,
    #       dream_id: comment.dream_id,
    #       user_id: comment.user_id,
    #       timestamp: comment.inserted_at,
    #       updated: comment.updated_at
    #     }
    #   end)
    push(socket, "list_dreams", %{dreams: dreams})
    {:noreply, socket}
  end

  @impl true
  def handle_in("joined_my_feed", payload, socket) do
    {id, _} = Integer.parse(payload["user_id"])
    IO.inspect(id)

    dreams =
      DreamShare.Dreams.get_dreams_by_user_id(id)
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

  @impl true
  def handle_in("find_user", user, socket) do
    user = DreamShare.Accounts.get_user_by_username(user)
    IO.inspect(user)

    if user do
      push(socket, "found_user", %{
        username: user.username,
        full_name: user.full_name,
        id: user.id
      })
    else
      push(socket, "user_not_found", %{
        message:
          "Sorry, there is no user with that username. please make sure the spelling and capitalization is correct :)"
      })
    end

    {:noreply, socket}
  end

  def handle_in("get_dreams_by_user_id", payload, socket) do
    {id, _} = Integer.parse(payload["user_id"])

    dreams =
      DreamShare.Dreams.get_dreams_by_user_id(id)
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

    IO.inspect(dreams)
    push(socket, "list_user_dreams", %{dreams: dreams})
    {:noreply, socket}
  end

  # @impl true
  # def handle_in("updated_dream", dream, socket) do
  #   IO.inspect("below is dream updated")
  #   IO.inspect(dream["data"]["id"])
  #   dream_id = dream["data"]["id"]
  #   dream = DreamShare.Dreams.get_dream!(dream_id)
  #
  #   push(socket, "updated_dream", %{
  #     id: dream.id,
  #     dream: dream.dream,
  #     username: dream.username,
  #     timestamp: dream.inserted_at,
  #     user_id: dream.user_id,
  #     updated: dream.updated_at
  #   })
  #
  #   {:noreply, socket}
  # end

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
