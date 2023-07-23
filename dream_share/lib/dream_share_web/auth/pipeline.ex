defmodule DreamShareWeb.Auth.Pipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :dream_share,
    module: DreamShareWeb.Auth.Guardian,
    error_handler: DreamShareWeb.Auth.GuardianErrorHandler

  plug Guardian.Plug.VerifySession
  plug Guardian.Plug.VerifyHeader
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource
end
