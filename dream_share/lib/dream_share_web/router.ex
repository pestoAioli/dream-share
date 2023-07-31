defmodule DreamShareWeb.Router do
  use DreamShareWeb, :router

  import DreamShareWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_user
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_current_user
  end

  scope "/", DreamShareWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  # Other scopes may use custom stacks.
  # scope "/api", DreamShareWeb do
  #   pipe_through :api
  # end

  # Enable Swoosh mailbox preview in development
  if Application.compile_env(:dream_share, :dev_routes) do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  ## Authentication routes

  scope "/", DreamShareWeb do
    pipe_through [:api]

    get "/users", UserAuthController, :index
    patch "/users", UserAuthController, :update
    post "/users/log_in", UserAuthController, :login
    post "/users/register", UserAuthController, :register
    post "/users/confirm_email", UserAuthController, :confirm_email
    post "/users/reset_password", UserAuthController, :reset_password
    post "/users/forgot_password", UserAuthController, :forgot_password
  end
end
