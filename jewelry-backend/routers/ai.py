from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, UserGeneratedDesign
from ..schemas import AIDesignRequest, AIDesignResponse
from ..routers.auth import get_current_user
import os
import uuid
import requests
from google import genai
from google.genai import types

router = APIRouter(prefix="/ai", tags=["ai"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

@router.post("/generate-design", response_model=AIDesignResponse)
def generate_design(request: AIDesignRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not client:
         raise HTTPException(status_code=500, detail="Gemini API Key is not configured")
         
    # 1. Construct detailed text prompt
    prompt = f"A highly detailed, photorealistic image of a luxury jewelry {request.type}. "
    prompt += f"The main material is {request.karat} {request.color} {request.material}. "
    if request.gemstone_type and request.gemstone_type.lower() != "none":
        prompt += f"It features a {request.shape} cut {request.gemstone_color} {request.gemstone_type} as the center stone. "
    else:
        prompt += f"It has a {request.shape} design. "
    prompt += "Professional studio lighting, isolated on a white or elegant background, 8k resolution, highly reflective, commercial product photography."

    try:
        # 2. Call Gemini API
        response = client.models.generate_images(
            model='gemini-3-pro-image-preview',
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="1:1",
                output_mime_type="image/jpeg",
            )
        )
        
        if not response.generated_images:
             raise HTTPException(status_code=500, detail="Failed to generate image from AI")
             
        generated_image = response.generated_images[0]
        
        # 4. Save image locally
        filename = f"{uuid.uuid4()}.jpg"
        save_dir = "static/generated_designs"
        os.makedirs(save_dir, exist_ok=True)
        filepath = os.path.join(save_dir, filename)
        
        # Determine how to save based on response type (b64 vs url)
        # GenAI SDK usually returns bytes in image.image.image_bytes
        if hasattr(generated_image, 'image') and hasattr(generated_image.image, 'image_bytes'):
            with open(filepath, "wb") as f:
                f.write(generated_image.image.image_bytes)
        else:
            raise HTTPException(status_code=500, detail="Could not extract image bytes from response")

        local_url = f"/{filepath.replace('\\', '/')}"
        
        # 5. Save record to DB
        new_design = UserGeneratedDesign(
            user_id=current_user.id,
            selected_options=request.model_dump(),
            generated_image_url=local_url
        )
        db.add(new_design)
        db.commit()
        db.refresh(new_design)
        
        # 6. Return Data
        return AIDesignResponse(
            id=new_design.id,
            generated_image_url=local_url,
            selected_options=new_design.selected_options
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
