defmodule DreamShare.Repo.Migrations.CreateDreams do
  use Ecto.Migration

  def change do
    create table(:dreams) do
      add :body, :string
      add :comments, :text
      add :likes_count, :integer
      add :username, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:dreams, [:username])
  end
end
