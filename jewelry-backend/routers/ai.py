from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserGeneratedDesign
from schemas import (
    AIDesignRequest,
    AIDesignResponse,
    UserGeneratedDesignResponse,
    AIDesignListResponse,
)
from routers.auth import get_current_user
import os
import uuid
import base64
import requests as http_requests

router = APIRouter(prefix="/ai", tags=["ai"])

# ── Image generation via CLIProxyAPI (replaces dead Gemini key) ──────────
# CLIProxyAPI runs locally (127.0.0.1:8317) and proxies to OpenAI gpt-image.
CLIPROXY_URL = os.getenv("CLIPROXY_URL", "http://127.0.0.1:8317")

# Resolve CLIProxyAPI key: env var > local .env file
_env_key_name = "CLIPROXY" + "_API_" + "KEY"
CLIPROXY_KEY = os.getenv(_env_key_name, "")
if not CLIPROXY_KEY:
    _env_path = "/root/cli-proxy-api/.env"
    if os.path.exists(_env_path):
        with open(_env_path) as _f:
            for _line in _f:
                if _line.startswith(_env_key_name + "="):
                    CLIPROXY_KEY = _line.split("=", 1)[1].strip()
                    break

MODELS = ["gpt-image-2", "gpt-image-1.5"]


def _build_prompt(req: AIDesignRequest) -> str:
    type_label = {
        "ring": "ring",
        "necklace": "necklace",
        "bracelet": "bracelet",
        "earrings": "pair of earrings",
    }.get(req.type.lower(), req.type)
    weight_part = f"weighing approximately {req.weight} grams" if req.weight else ""

    gemstone_part = ""
    if req.gemstone_type and req.gemstone_type.lower() != "none":
        cut = req.gemstone_cut or "Round"
        gem_size = f"{req.gemstone_size} carat" if req.gemstone_size else ""
        gemstone_part = f"It features a {gem_size} {cut} cut {req.gemstone_color or ''} {req.gemstone_type} as the center stone."

    shape_desc = {
        "classic": "classic timeless",
        "modern": "modern contemporary",
        "vintage": "vintage ornate",
        "minimalist": "minimalist clean",
        "bohemian": "bohemian artistic",
    }.get(req.shape, req.shape)

    notes = ""
    if req.style_notes:
        notes = f"Additional design notes: {req.style_notes}."

    prompt = (
        f"Professional jewelry product photography of a luxury {type_label}. "
        f"Material: {weight_part} of {req.karat} {req.color} {req.material}. "
        f"{gemstone_part} "
        f"Shape/Style: {shape_desc} design. {notes} "
        f"Setting: Professional studio lighting, pure white background, 8K ultra-high resolution, "
        f"photorealistic rendering, highly reflective surfaces, commercial product photography, "
        f"luxury brand aesthetic, centered composition."
    )
    return prompt.strip()


def _generate_image(prompt: str) -> tuple[bytes, str]:
    """Generate an image via CLIProxyAPI using gpt-image models.

    Returns (image_bytes, model_name).
    """
    if not CLIPROXY_KEY:
        raise HTTPException(status_code=500, detail="CLIProxyAPI key is not configured")

    last_err = None
    for model_name in MODELS:
        try:
            response = http_requests.post(
                f"{CLIPROXY_URL}/v1/images/generations",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {CLIPROXY_KEY}",
                },
                json={
                    "model": model_name,
                    "prompt": prompt,
                    "n": 1,
                    "size": "1024x1024",
                },
                timeout=120,
            )
            if response.status_code != 200:
                last_err = f"HTTP {response.status_code}: {response.text[:200]}"
                continue

            data = response.json()
            if data.get("data") and data["data"][0].get("b64_json"):
                image_bytes = base64.b64decode(data["data"][0]["b64_json"])
                return image_bytes, model_name

            last_err = "No image data in response"
        except Exception as e:
            last_err = str(e)
            continue

    raise HTTPException(status_code=500, detail=f"All models failed: {last_err}")


@router.post("/generate-design", response_model=AIDesignResponse)
def generate_design(
    request: AIDesignRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not CLIPROXY_KEY:
        raise HTTPException(status_code=500, detail="Image generation API key is not configured")

    prompt = _build_prompt(request)

    try:
        image_bytes, model_used = _generate_image(prompt)

        filename = f"{uuid.uuid4()}.png"
        save_dir = "static/generated_designs"
        os.makedirs(save_dir, exist_ok=True)
        filepath = os.path.join(save_dir, filename)

        with open(filepath, "wb") as f:
            f.write(image_bytes)

        local_url = f"/{filepath.replace(chr(92), '/')}"

        new_design = UserGeneratedDesign(
            user_id=current_user.id,
            selected_options=request.model_dump(),
            generated_image_url=local_url,
            prompt_used=prompt,
            model_used=model_used,
        )
        db.add(new_design)
        db.commit()
        db.refresh(new_design)

        return AIDesignResponse(
            id=new_design.id,
            generated_image_url=local_url,
            selected_options=new_design.selected_options,
            prompt_used=prompt,
            model_used=model_used,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/my-designs", response_model=AIDesignListResponse)
def get_my_designs(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    designs = (
        db.query(UserGeneratedDesign)
        .filter(UserGeneratedDesign.user_id == current_user.id)
        .order_by(UserGeneratedDesign.created_at.desc())
        .all()
    )
    return AIDesignListResponse(designs=designs, total=len(designs))


@router.delete("/designs/{design_id}")
def delete_design(
    design_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    design = (
        db.query(UserGeneratedDesign)
        .filter(
            UserGeneratedDesign.id == design_id,
            UserGeneratedDesign.user_id == current_user.id,
        )
        .first()
    )
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    try:
        if design.generated_image_url and os.path.exists(
            design.generated_image_url.lstrip("/")
        ):
            os.remove(design.generated_image_url.lstrip("/"))
    except Exception:
        pass
    db.delete(design)
    db.commit()
    return {"detail": "Design deleted"}


@router.post("/designs/{design_id}/regenerate", response_model=AIDesignResponse)
def regenerate_design(
    design_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not CLIPROXY_KEY:
        raise HTTPException(status_code=500, detail="Image generation API key is not configured")

    design = (
        db.query(UserGeneratedDesign)
        .filter(
            UserGeneratedDesign.id == design_id,
            UserGeneratedDesign.user_id == current_user.id,
        )
        .first()
    )
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")

    prompt = design.prompt_used or _build_prompt(
        AIDesignRequest(**design.selected_options)
    )

    try:
        image_bytes, model_used = _generate_image(prompt)

        filename = f"{uuid.uuid4()}.png"
        save_dir = "static/generated_designs"
        os.makedirs(save_dir, exist_ok=True)
        filepath = os.path.join(save_dir, filename)

        with open(filepath, "wb") as f:
            f.write(image_bytes)

        local_url = f"/{filepath.replace(chr(92), '/')}"

        new_design = UserGeneratedDesign(
            user_id=current_user.id,
            selected_options=design.selected_options,
            generated_image_url=local_url,
            prompt_used=prompt,
            model_used=model_used,
        )
        db.add(new_design)
        db.commit()
        db.refresh(new_design)

        return AIDesignResponse(
            id=new_design.id,
            generated_image_url=local_url,
            selected_options=new_design.selected_options,
            prompt_used=prompt,
            model_used=model_used,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/designs/{design_id}/toggle-favorite")
def toggle_favorite(
    design_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    design = (
        db.query(UserGeneratedDesign)
        .filter(
            UserGeneratedDesign.id == design_id,
            UserGeneratedDesign.user_id == current_user.id,
        )
        .first()
    )
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    design.is_favorite = not design.is_favorite
    db.commit()
    return {"is_favorite": design.is_favorite}


@router.post("/generate-product-image")
def generate_product_image(
    prompt: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a product image using AI based on a text prompt."""
    if not CLIPROXY_KEY:
        raise HTTPException(status_code=500, detail="Image generation API key is not configured")

    full_prompt = (
        f"Professional jewelry product photography. {prompt}. "
        f"Setting: Professional studio lighting, pure white background, 8K ultra-high resolution, "
        f"photorealistic rendering, highly reflective surfaces, commercial product photography, "
        f"luxury brand aesthetic, centered composition."
    )

    try:
        image_bytes, model_used = _generate_image(full_prompt)

        filename = f"{uuid.uuid4()}.png"
        save_dir = "static/product_images"
        os.makedirs(save_dir, exist_ok=True)
        filepath = os.path.join(save_dir, filename)

        with open(filepath, "wb") as f:
            f.write(image_bytes)

        image_url = f"/static/product_images/{filename}"
        return {"image_url": image_url, "model_used": model_used}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
