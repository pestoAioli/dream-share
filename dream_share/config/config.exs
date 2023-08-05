# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :dream_share,
  ecto_repos: [DreamShare.Repo]

# Configures the endpoint
config :dream_share, DreamShareWeb.Endpoint,
  url: [host: "https://dreaming-of-u.com"],
  render_errors: [
    formats: [html: DreamShareWeb.ErrorHTML, json: DreamShareWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: DreamShare.PubSub,
  live_view: [signing_salt: "yX9W05RC"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :dream_share, DreamShare.Mailer, adapter: Swoosh.Adapters.Local

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
