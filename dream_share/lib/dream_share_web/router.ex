defmodule DreamShareWeb.Router do
  use DreamShareWeb, :router
  use Plug.ErrorHandler

  @impl Plug.ErrorHandler
  def handle_errors(conn, %{reason: %Phoenix.Router.NoRouteError{message: message}}) do
    conn
    |> json(%{errors: message})
    |> halt()
  end

  @impl Plug.ErrorHandler
  def handle_errors(conn, %{reason: %{message: message}}) do
    conn
    |> json(%{errors: message})
    |> halt()
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
  end

  pipeline :auth do
    plug DreamShareWeb.Auth.Pipeline
    plug DreamShareWeb.Auth.SetAccount
  end

  scope "/api", DreamShareWeb do
    pipe_through :api
    post "/accounts/create", AccountController, :create
    post "/accounts/sign_in", AccountController, :sign_in
    resources "/dreams", DreamController, except: [:new, :edit]
  end

  scope "/api", DreamShareWeb do
    pipe_through [:api, :auth]
    get "/accounts/by_id/:id", AccountController, :show
    post "/accounts/update", AccountController, :update
  end
end
