defmodule DreamShare.DreamsTest do
  use DreamShare.DataCase

  alias DreamShare.Dreams

  describe "dreams" do
    alias DreamShare.Dreams.Dream

    import DreamShare.DreamsFixtures

    @invalid_attrs %{body: nil, comments: nil, likes_count: nil}

    test "list_dreams/0 returns all dreams" do
      dream = dream_fixture()
      assert Dreams.list_dreams() == [dream]
    end

    test "get_dream!/1 returns the dream with given id" do
      dream = dream_fixture()
      assert Dreams.get_dream!(dream.id) == dream
    end

    test "create_dream/1 with valid data creates a dream" do
      valid_attrs = %{body: "some body", comments: "some comments", likes_count: 42}

      assert {:ok, %Dream{} = dream} = Dreams.create_dream(valid_attrs)
      assert dream.body == "some body"
      assert dream.comments == "some comments"
      assert dream.likes_count == 42
    end

    test "create_dream/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Dreams.create_dream(@invalid_attrs)
    end

    test "update_dream/2 with valid data updates the dream" do
      dream = dream_fixture()
      update_attrs = %{body: "some updated body", comments: "some updated comments", likes_count: 43}

      assert {:ok, %Dream{} = dream} = Dreams.update_dream(dream, update_attrs)
      assert dream.body == "some updated body"
      assert dream.comments == "some updated comments"
      assert dream.likes_count == 43
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
end
