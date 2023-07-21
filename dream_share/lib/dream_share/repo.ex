defmodule DreamShare.Repo do
  use Ecto.Repo,
    otp_app: :dream_share,
    adapter: Ecto.Adapters.Postgres
end
