import torch
import torchvision.transforms.functional as TF
from PIL import Image
import pandas as pd
import numpy as np
from app.models.model import CNN
from app.core.config import settings
import io
import logging

logger = logging.getLogger(__name__)

class InferenceService:
    def __init__(self):
        self.model = CNN(39)
        try:
            self.model.load_state_dict(torch.load(settings.MODEL_PATH, map_location=torch.device('cpu')))
            self.model.eval()
            logger.info("Model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
        
        try:
            self.disease_info = pd.read_csv(settings.CSV_PATH, encoding='cp1252')
            logger.info("Disease info CSV loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load CSV: {e}")

    def predict(self, image_bytes: bytes):
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            image = image.resize((224, 224))
            input_data = TF.to_tensor(image)
            input_data = input_data.view((-1, 3, 224, 224))
            
            with torch.no_grad():
                output = self.model(input_data)
                
            output = output.detach().numpy()
            index = int(np.argmax(output))
            
            # Calculate simple confidence score using softmax
            tensor_output = torch.tensor(output)
            probabilities = torch.nn.functional.softmax(tensor_output, dim=1)
            confidence = float(torch.max(probabilities).numpy()) * 100.0
            
            info = self.disease_info.iloc[index]
            
            return {
                "prediction_index": index,
                "disease_name": str(info['disease_name']),
                "description": str(info['description']),
                "possible_steps": str(info['Possible Steps']),
                "image_url": str(info['image_url']),
                "confidence": round(confidence, 2)
            }
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            raise e

inference_service = InferenceService()
