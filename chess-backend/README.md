# Chess Trainer backend

A FastAPI service that stores opening repertoires in PostgreSQL.

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Python 3.10 or newer

## Setup

All commands start from the repository root unless stated otherwise.

1. **Configure the database password.** Copy `.env.example` to `.env` in the repository root, then set your database password.

2. **Start PostgreSQL.**

   ```bash
   docker compose up -d
   ```

   On first initialisation, PostgreSQL creates the `chess_trainer` database, runs `schema.sql` to create the tables, and runs `seed.sql` to insert the default repertoire. These scripts won't run again if the database volume already exists.

   The frontend currently loads the repertoire with id 1, which is the one `seed.sql` creates. Keep that in mind if you change the seed.

3. **Install the Python dependencies.**

   ```bash
   cd chess-backend
   python -m venv .venv

   # Windows PowerShell
   .venv\Scripts\Activate.ps1

   # macOS / Linux
   source .venv/bin/activate

   pip install -r requirements.txt
   ```

4. **Configure the backend.** From inside `chess-backend`, copy `.env.example` to `.env` and set the same password as in step 1.

5. **Run the server.**

   ```bash
   fastapi dev main.py
   ```

   The API runs at `http://127.0.0.1:8000`, with interactive docs at `http://127.0.0.1:8000/docs`.

The backend only accepts browser requests from the frontend at `http://localhost:3000` (CORS). If your frontend runs elsewhere, add its address to `allow_origins` in `main.py`.

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/repertoires` | List all repertoires |
| `POST` | `/repertoires` | Create a repertoire with an empty tree |
| `GET` | `/repertoires/{id}/tree` | Load a repertoire's move tree |
| `PUT` | `/repertoires/{id}/tree` | Replace a repertoire's move tree |

## Useful commands

```bash
docker compose exec db psql -U postgres -d chess_trainer   # open a SQL shell
docker compose down -v                                     # WARNING: permanently deletes the database volume and all saved repertoires
```