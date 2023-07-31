defmodule DreamShareWeb.UserAuthController do
  use DreamShareWeb, :controller

  alias DreamShare.Accounts
  alias DreamShare.Repo
  import DreamShareWeb.UserAuth

  plug :require_authenticated_user when action in [:index, :update]
  plug :require_guest_user when action in [:login, :register]
  plug :get_user_by_reset_password_token when action in [:reset_password]

  def index(conn, _) do
    render(conn, "index.json", user: conn.assigns[:current_user])
  end

  def update(conn, %{"user" => params}) do
    user = conn.assigns[:current_user]
    changeset = Accounts.change_account(user, params)

    with {:ok, user} <- Repo.update(changeset) do
      render(conn, "update.json", user: user)
    end
  end

  def login(conn, %{"email" => email, "password" => password}) do
    if user = Accounts.get_user_by_email_and_password(email, password) do
      if user.is_active do
        token = get_token(user)
        render(conn, "login.json", user: user, token: token)
      else
        {:error, :bad_request,
         "Your account is not active. Check your inbox for a confirmation email."}
      end
    else
      {:error, :bad_request, "Invalid username or password."}
    end
  end

  def register(conn, %{"user" => params}) do
    with {:ok, user} <- Accounts.register_user(params) do
      Accounts.deliver_user_confirmation_instructions(user, fn token -> "#{token}" end)

      conn
      |> put_status(201)
      |> render("register.json", user: user)
    end
  end

  def forgot_password(conn, %{"email" => email}) do
    if user = Accounts.get_user_by_email(email) do
      # Build your token url here...
      Accounts.deliver_user_reset_password_instructions(user, fn token -> "#{token}" end)
    end

    # Render the same view to prevent enumeration attacks.
    render(conn, "forgot_password.json")
  end

  def reset_password(conn, %{
        "password" => password,
        "password_confirmation" => password_confirmation
      }) do
    Accounts.reset_user_password(conn.assigns.user, %{
      password: password,
      password_confirmation: password_confirmation
    })

    render(conn, "reset_password.json")
  end

  def confirm_email(conn, %{"token" => token}) do
    case Accounts.confirm_user(token) do
      {:ok, _} ->
        render(conn, "confirm_email.json")

      :error ->
        {:error, :bad_request, "Invalid confirmation token."}
    end
  end

  defp get_user_by_reset_password_token(conn, _opts) do
    if conn.params["token"] do
      %{"token" => token} = conn.params

      if user = Accounts.get_user_by_reset_password_token(token) do
        conn
        |> assign(:user, user)
        |> assign(:token, token)
      else
        conn
        |> put_status(401)
        |> put_view(BoilerNameWeb.ErrorJSON)
        |> render(:"401")
        |> halt()
      end
    else
      conn
      |> put_status(401)
      |> put_view(BoilerNameWeb.ErrorJSON)
      |> render(:"401")
      |> halt()
    end
  end
end
