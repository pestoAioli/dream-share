defmodule DreamShare.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :about, :string
    field :username, :string
    belongs_to :account, DreamShare.Accounts.Account

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:username, :about])
    |> validate_required([:account_id])
  end
end
