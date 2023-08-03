defmodule DreamShare.Accounts.Account do
  use Ecto.Schema
  import Ecto.Changeset

  schema "accounts" do
    field :about, :string
    field :pfp, :string
    field :username, :string
    belongs_to :user, DreamShare.Accounts.User

    timestamps()
  end

  @doc false
  def changeset(account, attrs) do
    account
    |> cast(attrs, [:username, :about, :pfp])
    |> validate_required([:username])
  end
end
