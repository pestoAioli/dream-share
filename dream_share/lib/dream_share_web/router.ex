defmodule DreamShareWeb.Router do
  use DreamShareWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", DreamShareWeb do
    pipe_through :api
  end
end
