defmodule DreamShare.Dreams.Dream do
  use Ecto.Schema
  import Ecto.Changeset

  schema "dreams" do
    field :dream, :string
    field :username, :string
    field :user_id, :id
    has_many :comments, DreamShare.Dreams.Comment, on_delete: :delete_all

    timestamps()
  end

  @doc false
  def changeset(dream, attrs) do
    dream
    |> cast(attrs, [:dream, :username])
    |> validate_required([:dream, :username])
  end
end
