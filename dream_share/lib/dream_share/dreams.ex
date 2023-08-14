defmodule DreamShare.Dreams do
  @moduledoc """
  The Dreams context.
  """

  import Ecto.Query, warn: false
  alias DreamShare.Repo

  alias DreamShare.Dreams.Dream

  @doc """
  Returns the list of dreams.

  ## Examples

      iex> list_dreams()
      [%Dream{}, ...]

  """
  def list_dreams do
    Repo.all(Dream)
  end

  @doc """
  Gets a single dream.

  Raises `Ecto.NoResultsError` if the Dream does not exist.

  ## Examples

      iex> get_dream!(123)
      %Dream{}

      iex> get_dream!(456)
      ** (Ecto.NoResultsError)

  """
  def get_dream!(id), do: Repo.get!(Dream, id)

  @doc """
  gets dreams by user_id
  """
  def get_dreams_by_user_id(id) do
    dream = from d in Dream, where: d.user_id == ^id
    Repo.all(dream)
  end

  @doc """
  Creates a dream.

  ## Examples

      iex> create_dream(%{field: value})
      {:ok, %Dream{}}

      iex> create_dream(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_dream(user_id, username, attrs \\ %{}) do
    %Dream{user_id: user_id, username: username}
    |> Dream.changeset(attrs)
    |> Repo.insert()
    |> broadcast(:dream_created)
  end

  @doc """
  Updates a dream.

  ## Examples

      iex> update_dream(dream, %{field: new_value})
      {:ok, %Dream{}}

      iex> update_dream(dream, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_dream(%Dream{} = dream, attrs) do
    dream
    |> Dream.changeset(attrs)
    |> Repo.update()
    |> broadcast(:dream_updated)
  end

  @doc """
  Deletes a dream.

  ## Examples

      iex> delete_dream(dream)
      {:ok, %Dream{}}

      iex> delete_dream(dream)
      {:error, %Ecto.Changeset{}}

  """
  def delete_dream(%Dream{} = dream) do
    Repo.delete(dream)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking dream changes.

  ## Examples

      iex> change_dream(dream)
      %Ecto.Changeset{data: %Dream{}}

  """
  def change_dream(%Dream{} = dream, attrs \\ %{}) do
    Dream.changeset(dream, attrs)
  end

  def subscribe do
    Phoenix.PubSub.subscribe(DreamShare.PubSub, "dreams:lobby")
  end

  defp broadcast({:error, _reason} = error, _event), do: error

  defp broadcast({:ok, payload}, event) do
    Phoenix.PubSub.broadcast(DreamShare.PubSub, "dreams:lobby", {event, payload})
    {:ok, payload}
  end

  alias DreamShare.Dreams.Comment

  @doc """
  Returns the list of comments.

  ## Examples

      iex> list_comments()
      [%Comment{}, ...]

  """
  def list_comments do
    Repo.all(Comment)
  end

  @doc """
  Gets a single comment.

  Raises `Ecto.NoResultsError` if the Comment does not exist.

  ## Examples

      iex> get_comment!(123)
      %Comment{}

      iex> get_comment!(456)
      ** (Ecto.NoResultsError)

  """
  def get_comment!(id), do: Repo.get!(Comment, id)

  @doc """
  gets comments by dream_id
  """
  def get_comments_by_dream_id(id) do
    comment = from c in Comment, where: c.dream_id == ^id
    Repo.all(comment)
  end

  @doc """
  Creates a comment.

  ## Examples

      iex> create_comment(%{field: value})
      {:ok, %Comment{}}

      iex> create_comment(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_comment(user_id, username, attrs \\ %{}) do
    %Comment{user_id: user_id, username: username}
    |> Comment.changeset(attrs)
    |> Repo.insert()
    |> broadcast(:comment_created)
  end

  @doc """
  Updates a comment.

  ## Examples

      iex> update_comment(comment, %{field: new_value})
      {:ok, %Comment{}}

      iex> update_comment(comment, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_comment(%Comment{} = comment, attrs) do
    comment
    |> Comment.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a comment.

  ## Examples

      iex> delete_comment(comment)
      {:ok, %Comment{}}

      iex> delete_comment(comment)
      {:error, %Ecto.Changeset{}}

  """
  def delete_comment(%Comment{} = comment) do
    Repo.delete(comment)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking comment changes.

  ## Examples

      iex> change_comment(comment)
      %Ecto.Changeset{data: %Comment{}}

  """
  def change_comment(%Comment{} = comment, attrs \\ %{}) do
    Comment.changeset(comment, attrs)
  end
end
