defmodule DreamShare.Repo.Migrations.AlterComments do
  use Ecto.Migration

  def change do
    alter table(:comments) do
      add :username, :string
    end
  end
end
