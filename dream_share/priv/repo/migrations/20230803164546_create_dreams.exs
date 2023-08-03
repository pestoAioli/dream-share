defmodule DreamShare.Repo.Migrations.CreateDreams do
  use Ecto.Migration

  def change do
    create table(:dreams) do
      add :dream, :string
      add :username, :string
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:dreams, [:user_id])
  end
end
