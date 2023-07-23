defmodule DreamShareWeb.DreamControllerTest do
  use DreamShareWeb.ConnCase

  import DreamShare.DreamsFixtures

  alias DreamShare.Dreams.Dream

  @create_attrs %{
    body: "some body",
    comments: "some comments",
    likes_count: 42
  }
  @update_attrs %{
    body: "some updated body",
    comments: "some updated comments",
    likes_count: 43
  }
  @invalid_attrs %{body: nil, comments: nil, likes_count: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all dreams", %{conn: conn} do
      conn = get(conn, ~p"/api/dreams")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create dream" do
    test "renders dream when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/dreams", dream: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/dreams/#{id}")

      assert %{
               "id" => ^id,
               "body" => "some body",
               "comments" => "some comments",
               "likes_count" => 42
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/dreams", dream: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update dream" do
    setup [:create_dream]

    test "renders dream when data is valid", %{conn: conn, dream: %Dream{id: id} = dream} do
      conn = put(conn, ~p"/api/dreams/#{dream}", dream: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/dreams/#{id}")

      assert %{
               "id" => ^id,
               "body" => "some updated body",
               "comments" => "some updated comments",
               "likes_count" => 43
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, dream: dream} do
      conn = put(conn, ~p"/api/dreams/#{dream}", dream: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete dream" do
    setup [:create_dream]

    test "deletes chosen dream", %{conn: conn, dream: dream} do
      conn = delete(conn, ~p"/api/dreams/#{dream}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/dreams/#{dream}")
      end
    end
  end

  defp create_dream(_) do
    dream = dream_fixture()
    %{dream: dream}
  end
end
