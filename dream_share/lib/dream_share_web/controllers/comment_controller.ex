defmodule DreamShareWeb.CommentController do
  use DreamShareWeb, :controller

  alias DreamShare.Dreams
  alias DreamShare.Dreams.Comment

  action_fallback DreamShareWeb.FallbackController

  def index(conn, _params) do
    comments = Dreams.list_comments()
    render(conn, :index, comments: comments)
  end

  def create(conn, %{"comment" => comment_params}) do
    with {:ok, %Comment{} = comment} <- Dreams.create_comment(comment_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/comments/#{comment}")
      |> render(:show, comment: comment)
    end
  end

  def show(conn, %{"id" => id}) do
    comment = Dreams.get_comment!(id)
    render(conn, :show, comment: comment)
  end

  def update(conn, %{"id" => id, "comment" => comment_params}) do
    comment = Dreams.get_comment!(id)

    with {:ok, %Comment{} = comment} <- Dreams.update_comment(comment, comment_params) do
      render(conn, :show, comment: comment)
    end
  end

  def delete(conn, %{"id" => id}) do
    comment = Dreams.get_comment!(id)

    with {:ok, %Comment{}} <- Dreams.delete_comment(comment) do
      send_resp(conn, :no_content, "")
    end
  end
end
