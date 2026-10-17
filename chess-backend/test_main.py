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
