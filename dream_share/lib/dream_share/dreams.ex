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

  defp broadcast({:ok, dream}, event) do
    Phoenix.PubSub.broadcast(DreamShare.PubSub, "dreams:lobby", {event, dream})
    {:ok, dream}
  end
end
