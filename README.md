# Chess Trainer

![CI](https://github.com/gabrielcipriani/chess-trainer/actions/workflows/ci.yml/badge.svg)

A web-based chess application for playing chess and practising openings, built with vanilla JavaScript and Vite.

## Features

* Legal move validation
* Check, checkmate and stalemate detection
* Pawn promotion
* En passant and castling

## Roadmap

* Move history
* Opening training with spaced repetition
* Python/PostgreSQL backend for repertoire storage

## Running Locally

### Development

```bash
cd chess-frontend
npm install
npm run dev
```

### Docker

```bash
cd chess-frontend
docker build -t chess-trainer .
docker run -p 8080:80 chess-trainer
```

Then open `http://localhost:8080`.
