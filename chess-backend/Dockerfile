FROM python:3.13-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["fastapi", "run", "main.py"]
LABEL org.opencontainers.image.source=https://github.com/gabrielcipriani/chess-trainer