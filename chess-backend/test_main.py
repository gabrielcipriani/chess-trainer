import os

import psycopg
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

EXAMPLE_TREE = {
    "move": None,
    "children": [
        {"move": "e2e4", "children": [{"move": "e7e5", "children": []}]},
        {"move": "d2d4", "children": []},
    ],
}


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

    save_response = client.put(f"/repertoires/{repertoire_id}/tree", json=EXAMPLE_TREE)
    assert save_response.status_code == 200
    load_response = client.get(f"/repertoires/{repertoire_id}/tree")
    assert load_response.status_code == 200
    assert EXAMPLE_TREE == load_response.json()


def test_saving_leaves_no_old_nodes():
    create_response = client.post(
        "/repertoires", json={"name": "Test", "color": "white"}
    )
    assert create_response.status_code == 201
    repertoire_id = create_response.json()["id"]

    save_response = client.put(f"/repertoires/{repertoire_id}/tree", json=EXAMPLE_TREE)
    assert save_response.status_code == 200

    with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
        row = conn.execute(
            "SELECT COUNT(*) FROM nodes WHERE repertoire_id = %s", (repertoire_id,)
        ).fetchone()
    assert row is not None
    nodes_count = row[0]
    # root, e2e4, e7e5, d2d4
    assert nodes_count == 4


def test_save_to_repertoire_that_does_not_exist_fails():
    create_response = client.post(
        "/repertoires", json={"name": "Test", "color": "white"}
    )
    assert create_response.status_code == 201
    # unique and guaranteed to not exist yet
    fake_repertoire_id = create_response.json()["id"] + 1

    save_response = client.put(
        f"/repertoires/{fake_repertoire_id}/tree", json=EXAMPLE_TREE
    )
    assert save_response.status_code == 404
