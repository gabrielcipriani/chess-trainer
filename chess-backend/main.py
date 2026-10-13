import os
from typing import Literal

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
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
        row = conn.execute(
            "INSERT INTO repertoires (name, color) VALUES (%s, %s) RETURNING id",
            (repertoire.name, repertoire.color),
        ).fetchone()
        assert row is not None
        conn.execute("INSERT INTO nodes (repertoire_id) VALUES (%s)", (row[0],))
    return {"id": row[0], "name": repertoire.name, "color": repertoire.color}


@app.get("/repertoires")
def list_repertoires():
    with psycopg.connect(DATABASE_URL) as conn:
        rows = conn.execute("SELECT id, name, color FROM repertoires").fetchall()
    repertoires = []
    for repertoire_id, name, color in rows:
        repertoires.append({"id": repertoire_id, "name": name, "color": color})
    return repertoires


@app.get("/repertoires/{repertoire_id}/tree")
def get_tree(repertoire_id: int):
    with psycopg.connect(DATABASE_URL) as conn:
        rows = conn.execute(
            "SELECT id, parent_id, move FROM nodes WHERE repertoire_id = %s",
            (repertoire_id,),
        ).fetchall()
    if not rows:
        raise HTTPException(status_code=404, detail="Repertoire not found")
    nodes = []
    for node_id, parent_id, move in rows:
        nodes.append({"id": node_id, "parent_id": parent_id, "move": move})
    return nodes
