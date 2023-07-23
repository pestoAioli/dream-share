defmodule DreamShare.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :username, :string
      add :about, :text
      add :account_id, references(:accounts, on_delete: :delete_all)

      timestamps()
    end

    create index(:users, [:account_id, :username])
  end
end
