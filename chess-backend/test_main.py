from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_create_repertoire_returns_the_new_repertoire():
    response = client.post("/repertoires", json={"name": "Test", "color": "white"})
    assert response.status_code == 201

    body = response.json()
    assert body["name"] == "Test"
    assert body["color"] == "white"
    assert isinstance(body["id"], int)


def test_create_repertoire_invalid_color_fails():
    response = client.post("/repertoires", json={"name": "Test", "color": "purple"})
    assert response.status_code == 422


def test_return_all_repertoires_oldest_first():
    created_first = client.post(
        "/repertoires", json={"name": "Test1", "color": "white"}
    )
    assert created_first.status_code == 201
    created_second = client.post(
        "/repertoires", json={"name": "Test2", "color": "white"}
    )
    assert created_second.status_code == 201

    all_repertoires = client.get("/repertoires")
    assert all_repertoires.status_code == 200
    assert [created_first.json(), created_second.json()] == all_repertoires.json()


def test_new_repertoire_returns_correct_tree():
    create_response = client.post(
        "/repertoires", json={"name": "Test", "color": "white"}
    )
    assert create_response.status_code == 201

    repertoire_id = create_response.json()["id"]
    load_response = client.get(f"/repertoires/{repertoire_id}/tree")
    assert load_response.status_code == 200

    assert load_response.json() == {"move": None, "children": []}


def test_load_tree_that_does_not_exist_fails():
    create_response = client.post(
        "/repertoires", json={"name": "Test", "color": "white"}
    )
    assert create_response.status_code == 201

    # unique and guaranteed to not exist yet
    fake_repertoire_id = create_response.json()["id"] + 1
    load_response = client.get(f"/repertoires/{fake_repertoire_id}/tree")
    assert load_response.status_code == 404


def test_save_then_load_returns_unchanged():
    create_response = client.post(
        "/repertoires", json={"name": "Test", "color": "white"}
    )
    assert create_response.status_code == 201
    repertoire_id = create_response.json()["id"]

    tree_to_save = {
        "move": None,
        "children": [
            {"move": "e2e4", "children": [{"move": "e7e5", "children": []}]},
            {"move": "d2d4", "children": []},
        ],
    }
    save_response = client.put(f"/repertoires/{repertoire_id}/tree", json=tree_to_save)
    assert save_response.status_code == 200

    load_response = client.get(f"/repertoires/{repertoire_id}/tree")
    assert load_response.status_code == 200
    assert tree_to_save == load_response.json()


def test_save_to_repertoire_that_does_not_exist_fails():
    create_response = client.post(
        "/repertoires", json={"name": "Test", "color": "white"}
    )
    assert create_response.status_code == 201
    # unique and guaranteed to not exist yet
    fake_repertoire_id = create_response.json()["id"] + 1

    tree_to_save = {"move": None, "children": [{"move": "e2e4", "children": []}]}
    save_response = client.put(
        f"/repertoires/{fake_repertoire_id}/tree", json=tree_to_save
    )
    assert save_response.status_code == 404
