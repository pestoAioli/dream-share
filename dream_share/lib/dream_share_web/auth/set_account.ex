defmodule DreamShareWeb.Auth.SetAccount do
  import Plug.Conn
  alias DreamShare.Accounts
  alias DreamShareWeb.Auth.UnauthorizedError

  def init(_options) do
  end

  def call(conn, _options) do
    if conn.assigns[:account] do
      conn
    else
      account_id = get_session(conn, :account_id)

      if account_id == nil, do: raise(UnauthorizedError, message: "account_id not found")

      account = Accounts.get_account!(account_id)

      cond do
        account_id && account -> assign(conn, :account, account)
        true -> assign(conn, :account, nil)
      end
    end
  end
end
