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
    get "/users/:id", UserController, :show
    get "/dreams", DreamController, :index
    post "/accounts/create", AccountController, :create
    post "/accounts/sign_in", AccountController, :sign_in
    # resources "/dreams", DreamController, except: [:new, :edit]
  end

  scope "/api", DreamShareWeb do
    pipe_through [:api, :auth]
    get "/accounts/by_id/:id", AccountController, :show
    get "/accounts/sign_out", AccountController, :sign_out
    get "/accounts/refresh_session", AccountController, :refresh_session
    post "/accounts/update", AccountController, :update
    post "/users/update", UserController, :update
    post "/dreams/create", DreamController, :create
  end
end
