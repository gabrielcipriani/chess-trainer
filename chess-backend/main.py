import os
from typing import Literal

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

load_dotenv()
app = FastAPI()
DATABASE_URL = os.environ["DATABASE_URL"]


class NewRepertoire(BaseModel):
    name: str
    color: Literal["white", "black"]


@app.post("/repertoires")
def create_repertoire(repertoire: NewRepertoire):
    with psycopg.connect(DATABASE_URL) as conn:
        conn.execute(
            "INSERT INTO repertoires (name, color) VALUES (%s, %s)",
            (repertoire.name, repertoire.color),
        )
    return repertoire


@app.get("/repertoires")
def list_repertoires():
    with psycopg.connect(DATABASE_URL) as conn:
        rows = conn.execute("SELECT id, name, color FROM repertoires").fetchall()
    repertoires = []
    for repertoire_id, name, color in rows:
        repertoires.append({"id": repertoire_id, "name": name, "color": color})
    return repertoires
