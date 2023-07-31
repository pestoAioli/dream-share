defmodule DreamShare.Repo.Migrations.CreateAccounts do
  use Ecto.Migration

  def change do
    create table(:accounts) do
      add :username, :string
      add :about, :text
      add :pfp, :string

      timestamps()
    end
  end
end
