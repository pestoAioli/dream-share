import Config

# Configures Swoosh API Client
config :swoosh, api_client: Swoosh.ApiClient.Finch, finch_name: DreamShare.Finch

# Disable Swoosh Local Memory Storage
config :swoosh, local: false

# Do not print debug messages in production
config :logger, level: :info

# Runtime production configuration, including reading
# of environment variables, is done on config/runtime.exs.
config :dream_share, DreamShare.Endpoint,
  check_origin: [
    "https://dreaming-of-u.vercel.app",
    "https://dreaming-of-u.com"
  ],
  url: [host: "https://dreaming-of-u.com", port: 80]
