defmodule DreamShare.Dreams.Dream do
  use Ecto.Schema
  import Ecto.Changeset

  schema "dreams" do
    field :body, :string
    field :comments, :string
    field :likes_count, :integer
    field :username, :id

    timestamps()
  end

  @doc false
  def changeset(dream, attrs) do
    dream
    |> cast(attrs, [:body, :comments, :likes_count])
    |> validate_required([:body, :comments, :likes_count])
  end
end
