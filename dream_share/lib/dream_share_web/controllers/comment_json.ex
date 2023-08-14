defmodule DreamShareWeb.CommentJSON do
  alias DreamShare.Dreams.Comment

  @doc """
  Renders a list of comments.
  """
  def index(%{comments: comments}) do
    %{data: for(comment <- comments, do: data(comment))}
  end

  @doc """
  Renders a single comment.
  """
  def show(%{comment: comment}) do
    %{data: data(comment)}
  end

  defp data(%Comment{} = comment) do
    %{
      id: comment.id,
      user_id: comment.user_id,
      dream_id: comment.dream_id,
      body: comment.body,
      username: comment.username
    }
  end
end
