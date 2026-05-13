import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Plant Disease AI Platform"
    API_V1_STR: str = "/api/v1"
    MODEL_PATH: str = os.getenv("MODEL_PATH", "plant_disease_model_1_latest.pt")
    CSV_PATH: str = os.getenv("CSV_PATH", "disease_info.csv")

    class Config:
        case_sensitive = True

settings = Settings()
