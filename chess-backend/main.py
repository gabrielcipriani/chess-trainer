import os
import psycopg
from fastapi import FastAPI

app = FastAPI()
DATABASE_URL = os.environ["DATABASE_URL"]


@app.get("/")
def root():
    return {"message": "hello world"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/repertoires")
def list_repertoires():
    with psycopg.connect(DATABASE_URL) as conn:
        rows = conn.execute("SELECT id, name, color FROM repertoires").fetchall()
    repertoires = []
    for repertoire_id, name, color in rows:
        repertoires.append({"id": repertoire_id, "name": name, "color": color})
    return repertoires
