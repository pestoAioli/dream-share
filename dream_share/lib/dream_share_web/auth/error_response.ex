defmodule DreamShareWeb.Auth.ErrorResponse.Unauthorized do
  defexception message: "Unauthorized", plug_status: 401
end

defmodule DreamShareWeb.Auth.ErrorResponse.Forbidden do
  defexception message: "Forbidden: You don't have access to this resource", plug_status: 403
end
