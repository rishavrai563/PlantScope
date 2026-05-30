from fastapi import APIRouter, UploadFile, File, HTTPException
from ray import serve
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/predict", summary="Predict plant disease from an image")
async def predict_disease(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    try:
        contents = await file.read()
        handle = serve.get_app_handle("inference_worker")
        result = await handle.predict.remote(contents)
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during prediction.")
