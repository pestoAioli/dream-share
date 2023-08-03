defmodule DreamShare.Repo.Migrations.AccountBelongsToUser do
  use Ecto.Migration

  def change do
    alter table(:accounts) do
      add :user_id, references(:users)
    end
  end
end
