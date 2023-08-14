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
        dream: "some dream",
        username: "some username"
      })
      |> DreamShare.Dreams.create_dream()

    dream
  end

  @doc """
  Generate a comment.
  """
  def comment_fixture(attrs \\ %{}) do
    {:ok, comment} =
      attrs
      |> Enum.into(%{
        body: "some body"
      })
      |> DreamShare.Dreams.create_comment()

    comment
  end
end
