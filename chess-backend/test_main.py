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
