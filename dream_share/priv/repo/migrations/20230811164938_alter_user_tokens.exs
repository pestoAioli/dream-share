defmodule DreamShare.Repo.Migrations.AlterUserTokens do
  use Ecto.Migration

  def change do
    alter table(:users_tokens) do
      add :user_agent, :string
    end
  end
end
