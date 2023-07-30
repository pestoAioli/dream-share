defmodule DreamShare.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      DreamShareWeb.Telemetry,
      # Start the Ecto repository
      DreamShare.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: DreamShare.PubSub},
      # Start Finch
      {Finch, name: DreamShare.Finch},
      # Start the Endpoint (http/https)
      DreamShareWeb.Endpoint
      # Start a worker by calling: DreamShare.Worker.start_link(arg)
      # {DreamShare.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: DreamShare.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    DreamShareWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
