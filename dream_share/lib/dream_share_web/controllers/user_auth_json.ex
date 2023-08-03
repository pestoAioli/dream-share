defmodule DreamShareWeb.UserAuthJSON do
  use DreamShareWeb, :view
  alias DreamShareWeb.UserAuthJSON

  def render("index.json", %{user: user}) do
    %{data: render_one(user, UserAuthJSON, "privileged_user.json", as: :user)}
  end

  def render("update.json", %{user: user}) do
    %{data: render_one(user, UserAuthJSON, "privileged_user.json", as: :user)}
  end

  def render("login.json", %{:user => user, :token => token}) do
    encoded_token = Base.encode64(token)

    %{
      data: %{
        user: render_one(user, UserAuthJSON, "privileged_user.json", as: :user)
      },
      token: encoded_token
    }
  end

  def render("logout.json", _params) do
    %{
      messages: ["Yuove been logged out"]
    }
  end

  def render("register.json", %{:user => user}) do
    %{
      data: render_one(user, UserAuthJSON, "privileged_user.json", as: :user)
    }
  end

  def render("forgot_password.json", _params) do
    %{
      messages: ["If the account exists, we've sent an email."]
    }
  end

  def render("reset_password.json", _params) do
    %{
      messages: ["Successfully reset password."]
    }
  end

  def render("confirm_email.json", _params) do
    %{
      messages: ["Successfully confirmed email."]
    }
  end

  def render("user.json", %{user: user}) do
    %{
      username: user.username
    }
  end

  def render("privileged_user.json", %{user: user}) do
    %{
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name
    }
  end
end
