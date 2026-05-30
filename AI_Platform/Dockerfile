# Stage 1: Build the React Frontend
FROM node:22-slim AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Python Backend
FROM python:3.8-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model weights and data
COPY plant_disease_model_1_latest.pt /app/plant_disease_model_1_latest.pt
COPY disease_info.csv /app/disease_info.csv

# Copy backend code
COPY backend/app /app/app

# Copy built frontend from Stage 1
COPY --from=frontend-builder /frontend/dist /frontend/dist

ENV MODEL_PATH=/app/plant_disease_model_1_latest.pt
ENV CSV_PATH=/app/disease_info.csv
ENV PYTHONPATH=/app

EXPOSE 7860

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
