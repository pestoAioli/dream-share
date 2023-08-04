defmodule DreamShareWeb.DreamJSON do
  alias DreamShare.Dreams.Dream

  @doc """
  Renders a list of dreams.
  """
  def index(%{dreams: dreams}) do
    %{data: for(dream <- dreams, do: data(dream))}
  end

  @doc """
  Renders a single dream.
  """
  def show(%{dream: dream}) do
    %{data: data(dream)}
  end

  defp data(%Dream{} = dream) do
    %{
      id: dream.id,
      dream: dream.dream,
      username: dream.username,
      user_id: dream.user_id
    }
  end
end
