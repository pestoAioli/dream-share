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
    with {:ok, %Dream{} = dream} <- Dreams.create_dream(dream_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/dreams/#{dream}")
      |> render(:show, dream: dream)
    end
  end

  def show(conn, %{"id" => id}) do
    dream = Dreams.get_dream!(id)
    render(conn, :show, dream: dream)
  end

  def update(conn, %{"id" => id, "dream" => dream_params}) do
    dream = Dreams.get_dream!(id)

    with {:ok, %Dream{} = dream} <- Dreams.update_dream(dream, dream_params) do
      render(conn, :show, dream: dream)
    end
  end

  def delete(conn, %{"id" => id}) do
    dream = Dreams.get_dream!(id)

    with {:ok, %Dream{}} <- Dreams.delete_dream(dream) do
      send_resp(conn, :no_content, "")
    end
  end
end
