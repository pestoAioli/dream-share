defmodule DreamShare.DreamsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `DreamShare.Dreams` context.
  """

  @doc """
  Generate a dream.
  """
  def dream_fixture(attrs \\ %{}) do
    {:ok, dream} =
      attrs
      |> Enum.into(%{
        content: "some content",
        username: "some username"
      })
      |> DreamShare.Dreams.create_dream(user_id: 0, username: "bob")

    dream
  end
end
