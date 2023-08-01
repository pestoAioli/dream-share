defmodule DreamShareWeb.UserAuth do
  use DreamShareWeb, :verified_routes

  import Plug.Conn
  import Phoenix.Controller

  alias DreamShare.Accounts

  # Make the remember me cookie valid for 60 days.
  # If you want bump or reduce this value, also change
  # the token expiry itself in UserToken.
  # @max_age 60 * 60 * 24 * 60
  # @remember_me_cookie "_dream_share_web_user_remember_me"
  # @remember_me_options [sign: true, max_age: @max_age, same_site: "Lax"]

  def get_token(user) do
    Accounts.generate_user_session_token(user)
  end

  def delete_token(token) do
    Accounts.delete_user_session_token(token)
  end

  @doc """
  Authenticates the user by looking into the session
  and remember me token.
  """
  def fetch_current_user(conn, _opts) do
    user_token = fetch_token(get_req_header(conn, "authorization"))
    user = user_token && Accounts.get_user_by_session_token(user_token)
    assign(conn, :current_user, user)
  end

  @doc """
  Used for routes that require the user to not be authenticated.
  """
  def require_guest_user(conn, _opts) do
    if conn.assigns[:current_user] do
      conn
      |> put_status(401)
      |> put_view(BoilerNameWeb.ErrorView)
      |> render(:"401")
      |> halt()
    else
      conn
    end
  end

  @doc """
  Used for routes that require the user to be authenticated.

  If you want to enforce the user email is confirmed before
  they use the application at all, here would be a good place.
  """
  def require_authenticated_user(conn, _opts) do
    if conn.assigns[:current_user] != nil and conn.assigns[:current_user].is_active do
      conn
    else
      conn
      |> put_status(401)
      |> put_view(BoilerNameWeb.ErrorView)
      |> render(:"401")
      |> halt()
    end
  end

  # Taken from https://github.com/bobbypriambodo/phoenix_token_plug/blob/master/lib/phoenix_token_plug/verify_header.ex
  defp fetch_token([]), do: nil

  defp fetch_token([token | _tail]) do
    token
    |> String.replace("Token ", "")
    |> String.trim()
  end
end
