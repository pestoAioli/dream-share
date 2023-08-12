defmodule DreamShare.DreamsTest do
  use DreamShare.DataCase

  alias DreamShare.Dreams

  describe "dreams" do
    alias DreamShare.Dreams.Dream

    import DreamShare.DreamsFixtures

    @invalid_attrs %{dream: nil, username: nil}

    test "list_dreams/0 returns all dreams" do
      dream = dream_fixture()
      assert Dreams.list_dreams() == [dream]
    end

    test "get_dream!/1 returns the dream with given id" do
      dream = dream_fixture()
      assert Dreams.get_dream!(dream.id) == dream
    end

    test "create_dream/1 with valid data creates a dream" do
      valid_attrs = %{dream: "some dream", username: "some username"}

      assert {:ok, %Dream{} = dream} = Dreams.create_dream(valid_attrs)
      assert dream.dream == "some dream"
      assert dream.username == "some username"
    end

    test "create_dream/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Dreams.create_dream(@invalid_attrs)
    end

    test "update_dream/2 with valid data updates the dream" do
      dream = dream_fixture()
      update_attrs = %{dream: "some updated dream", username: "some updated username"}

      assert {:ok, %Dream{} = dream} = Dreams.update_dream(dream, update_attrs)
      assert dream.dream == "some updated dream"
      assert dream.username == "some updated username"
    end

    test "update_dream/2 with invalid data returns error changeset" do
      dream = dream_fixture()
      assert {:error, %Ecto.Changeset{}} = Dreams.update_dream(dream, @invalid_attrs)
      assert dream == Dreams.get_dream!(dream.id)
    end

    test "delete_dream/1 deletes the dream" do
      dream = dream_fixture()
      assert {:ok, %Dream{}} = Dreams.delete_dream(dream)
      assert_raise Ecto.NoResultsError, fn -> Dreams.get_dream!(dream.id) end
    end

    test "change_dream/1 returns a dream changeset" do
      dream = dream_fixture()
      assert %Ecto.Changeset{} = Dreams.change_dream(dream)
    end
  end

  describe "comments" do
    alias DreamShare.Dreams.Comment

    import DreamShare.DreamsFixtures

    @invalid_attrs %{body: nil}

    test "list_comments/0 returns all comments" do
      comment = comment_fixture()
      assert Dreams.list_comments() == [comment]
    end

    test "get_comment!/1 returns the comment with given id" do
      comment = comment_fixture()
      assert Dreams.get_comment!(comment.id) == comment
    end

    test "create_comment/1 with valid data creates a comment" do
      valid_attrs = %{body: "some body"}

      assert {:ok, %Comment{} = comment} = Dreams.create_comment(valid_attrs)
      assert comment.body == "some body"
    end

    test "create_comment/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Dreams.create_comment(@invalid_attrs)
    end

    test "update_comment/2 with valid data updates the comment" do
      comment = comment_fixture()
      update_attrs = %{body: "some updated body"}

      assert {:ok, %Comment{} = comment} = Dreams.update_comment(comment, update_attrs)
      assert comment.body == "some updated body"
    end

    test "update_comment/2 with invalid data returns error changeset" do
      comment = comment_fixture()
      assert {:error, %Ecto.Changeset{}} = Dreams.update_comment(comment, @invalid_attrs)
      assert comment == Dreams.get_comment!(comment.id)
    end

    test "delete_comment/1 deletes the comment" do
      comment = comment_fixture()
      assert {:ok, %Comment{}} = Dreams.delete_comment(comment)
      assert_raise Ecto.NoResultsError, fn -> Dreams.get_comment!(comment.id) end
    end

    test "change_comment/1 returns a comment changeset" do
      comment = comment_fixture()
      assert %Ecto.Changeset{} = Dreams.change_comment(comment)
    end
  end
end
