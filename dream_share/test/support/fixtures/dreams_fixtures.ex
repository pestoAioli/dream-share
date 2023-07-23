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
        body: "some body",
        comments: "some comments",
        likes_count: 42
      })
      |> DreamShare.Dreams.create_dream()

    dream
  end
end
