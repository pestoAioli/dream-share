defmodule DreamShare.UsersFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `DreamShare.Users` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        about: "some about",
        full_name: "some full_name"
      })
      |> DreamShare.Users.create_user()

    user
  end
end
