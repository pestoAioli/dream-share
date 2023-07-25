defmodule DreamShare.Dreams.Dream do
  use Ecto.Schema
  import Ecto.Changeset

  schema "dreams" do
    field :content, :string
    field :username, :string
    belongs_to :user, DreamShare.Users.User, foreign_key: :user_id

    timestamps()
  end

  @doc false
  def changeset(dream, attrs) do
    dream
    |> cast(attrs, [:content, :username])
    |> validate_required([:content, :username])
  end
end
