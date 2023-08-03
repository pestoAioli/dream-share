defmodule DreamShare.Repo.Migrations.Alter do
  use Ecto.Migration

  def change do
    alter table(:dreams) do
      modify :dream, :text
    end
  end
end
