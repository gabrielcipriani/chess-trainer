import os
from typing import Literal

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
DATABASE_URL = os.environ["DATABASE_URL"]


class NewRepertoire(BaseModel):
    name: str
    color: Literal["white", "black"]


class TreeNode(BaseModel):
    move: str | None
    children: list["TreeNode"]


@app.post("/repertoires", status_code=status.HTTP_201_CREATED)
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
        rows = conn.execute(
            "SELECT id, name, color FROM repertoires ORDER BY id"
        ).fetchall()
    repertoires = []
    for repertoire_id, name, color in rows:
        repertoires.append({"id": repertoire_id, "name": name, "color": color})
    return repertoires


@app.get("/repertoires/{repertoire_id}/tree")
def get_tree(repertoire_id: int):
    with psycopg.connect(DATABASE_URL) as conn:
        rows = conn.execute(
            "SELECT id, parent_id, move FROM nodes WHERE repertoire_id = %s ORDER BY id",
            (repertoire_id,),
        ).fetchall()
    if not rows:
        raise HTTPException(status_code=404, detail="Repertoire not found")
    nodes_by_id = {}
    for node_id, parent_id, move in rows:
        nodes_by_id[node_id] = {"move": move, "children": []}
    for node_id, parent_id, move in rows:
        if parent_id is None:
            root = nodes_by_id[node_id]
        else:
            nodes_by_id[parent_id]["children"].append(nodes_by_id[node_id])
    return root


def insert_node(conn, repertoire_id: int, node: TreeNode, parent_id: int | None):
    row = conn.execute(
        "INSERT INTO nodes (repertoire_id, parent_id, move) VALUES (%s, %s, %s) RETURNING id",
        (repertoire_id, parent_id, node.move),
    ).fetchone()
    node_id = row[0]
    for child in node.children:
        insert_node(conn, repertoire_id, child, node_id)


@app.put("/repertoires/{repertoire_id}/tree")
def save_tree(repertoire_id: int, tree: TreeNode):
    with psycopg.connect(DATABASE_URL) as conn:
        # check if repertoire exists
        existing_repertoire = conn.execute(
            "SELECT id FROM repertoires WHERE id = %s", (repertoire_id,)
        ).fetchone()
        if not existing_repertoire:
            raise HTTPException(status_code=404, detail="Repertoire not found")
        conn.execute("DELETE FROM nodes WHERE repertoire_id = %s", (repertoire_id,))
        insert_node(conn, repertoire_id, tree, None)
    return tree
