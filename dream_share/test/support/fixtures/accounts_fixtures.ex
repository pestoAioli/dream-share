defmodule DreamShare.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `DreamShare.Accounts` context.
  """

  @doc """
  Generate a account.
  """
  def account_fixture(attrs \\ %{}) do
    {:ok, account} =
      attrs
      |> Enum.into(%{
        email: "some email",
        hash_password: "some hash_password"
      })
      |> DreamShare.Accounts.create_account()

    account
  end
end
