defmodule DreamShare.Dreams.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  schema "comments" do
    field :body, :string
    field :dream_id, :id
    field :user_id, :id
    field :username, :string

    timestamps()
  end

  @doc false
  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:body, :dream_id])
    |> validate_required([:body])
  end
end
