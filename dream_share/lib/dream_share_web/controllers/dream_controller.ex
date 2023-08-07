defmodule DreamShareWeb.DreamController do
  use DreamShareWeb, :controller

  alias DreamShare.Dreams
  alias DreamShare.Dreams.Dream

  action_fallback DreamShareWeb.FallbackController

  def index(conn, _params) do
    dreams = Dreams.list_dreams()
    render(conn, :index, dreams: dreams)
  end

  def create(conn, %{"dream" => dream_params}) do
    user = conn.assigns[:current_user]

    if user do
      with {:ok, %Dream{} = dream} <- Dreams.create_dream(user.id, user.username, dream_params) do
        conn
        |> put_status(:created)
        |> render(:show, dream: dream)
      end
    else
      {:error, :unauthorized}
    end
  end

  def show(conn, %{"id" => id}) do
    dream = Dreams.get_dream!(id)
    render(conn, :show, dream: dream)
  end

  def update(conn, %{"id" => id, "dream" => dream_params}) do
    user = conn.assigns[:current_user]
    dream = Dreams.get_dream!(id)
    user_id = dream.user_id
    IO.inspect(user_id)

    if user && user_id === user.id do
      with {:ok, %Dream{} = dream} <- Dreams.update_dream(dream, dream_params) do
        render(conn, :show, dream: dream)
      end
    else
      {:error, :unauthorized}
    end
  end

  def delete(conn, %{"id" => id}) do
    dream = Dreams.get_dream!(id)

    with {:ok, %Dream{}} <- Dreams.delete_dream(dream) do
      send_resp(conn, :no_content, "")
    end
  end
end
