defmodule DreamShareWeb.Router do
  use DreamShareWeb, :router

  import DreamShareWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["json"]
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_current_user
  end

  scope "/", DreamShareWeb do
    pipe_through :browser

    get "/dreams", DreamController, :index
    post "/user/register", UserAuthController, :register
    post "/user/log_in", UserAuthController, :login
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

  scope "/api", DreamShareWeb do
    pipe_through [:api]

    get "/user", UserAuthController, :index
    patch "/user", UserAuthController, :update
    get "/user/log_out", UserAuthController, :logout
    post "/user/confirm_email", UserAuthController, :confirm_email
    post "/user/reset_password", UserAuthController, :reset_password
    post "/user/forgot_password", UserAuthController, :forgot_password
    resources "/dreams", DreamController, except: [:new, :edit, :index]
  end
end
