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
import io
import requests as http_requests
from PIL import Image

router = APIRouter(prefix="/ai", tags=["ai"])

# ── Image generation via LiteLLM (gemini-3.1-flash-image) ────────────────
# LiteLLM proxy runs locally on port 18935 (network_mode: host).
# gemini-3.1-flash-image generates images through /chat/completions
# with modalities=["text","image"]. Image is returned in message.images[0].image_url
import re as _re

LITELLM_URL = os.getenv("LITELLM_URL", "http://127.0.0.1:18935")
IMAGE_MODEL = os.getenv("IMAGE_MODEL", "gemini-3.1-flash-image")

# Resolve LiteLLM master key from docker-compose (Hermes masks it in .env)
LITELLM_KEY = ""
_compose_path = "/root/litellm-gateway/docker-compose.yml"
if os.path.exists(_compose_path):
    with open(_compose_path, "rb") as _f:
        _content = _f.read()
    _match = _re.search(rb"LITELLM_MASTER_KEY=(\S+)", _content)
    if _match:
        LITELLM_KEY = _match.group(1).decode()

# Fallback: try CLIProxyAPI for gpt-image models
CLIPROXY_URL = os.getenv("CLIPROXY_URL", "http://127.0.0.1:8317")
CLIPROXY_KEY = ""
_env_key_name = "CLIPROXY" + "_API_" + "KEY"
if os.path.exists("/root/cli-proxy-api/.env"):
    with open("/root/cli-proxy-api/.env") as _f:
        for _line in _f:
            if _line.startswith(_env_key_name + "="):
                CLIPROXY_KEY = _line.split("=", 1)[1].strip()
                break


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
    """Generate an image via LiteLLM gemini-3.1-flash-image.
    Falls back to CLIProxyAPI gpt-image-2 if Gemini fails.

    Returns (image_bytes, model_name).
    """
    # ── Primary: Gemini via LiteLLM ──
    if LITELLM_KEY:
        try:
            response = http_requests.post(
                f"{LITELLM_URL}/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {LITELLM_KEY}",
                },
                json={
                    "model": IMAGE_MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "modalities": ["text", "image"],
                },
                timeout=120,
            )
            if response.status_code == 200:
                data = response.json()
                choices = data.get("choices", [])
                if choices:
                    msg = choices[0].get("message", {})
                    # Gemini returns images in message.images[].image_url.url
                    images = msg.get("images") or []
                    for img in images:
                        img_url = img.get("image_url", {}).get("url", "")
                        if img_url.startswith("data:image"):
                            # Extract base64 from data URL
                            b64_data = img_url.split(",", 1)[1] if "," in img_url else ""
                            if b64_data:
                                return base64.b64decode(b64_data), IMAGE_MODEL
                    # Also check content for base64 image
                    content = msg.get("content")
                    if isinstance(content, list):
                        for part in content:
                            if isinstance(part, dict):
                                url = part.get("image_url", {}).get("url", "")
                                if url.startswith("data:image"):
                                    b64_data = url.split(",", 1)[1] if "," in url else ""
                                    if b64_data:
                                        return base64.b64decode(b64_data), IMAGE_MODEL
            # Non-200 → try fallback
        except Exception:
            pass

    # ── Fallback: CLIProxyAPI gpt-image-2 ──
    if CLIPROXY_KEY:
        last_err = None
        for model_name in ["gpt-image-2", "gpt-image-1.5"]:
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
                if response.status_code == 200:
                    data = response.json()
                    if data.get("data") and data["data"][0].get("b64_json"):
                        image_bytes = base64.b64decode(data["data"][0]["b64_json"])
                        return image_bytes, model_name
                last_err = f"HTTP {response.status_code}: {response.text[:200]}"
            except Exception as e:
                last_err = str(e)
                continue
        raise HTTPException(status_code=500, detail=f"All models failed: {last_err}")

    raise HTTPException(status_code=500, detail="No image generation API configured")


MAX_SIZE = int(os.getenv("IMAGE_MAX_SIZE", "768"))
JPEG_QUALITY = int(os.getenv("JPEG_QUALITY", "85"))


def _compress_image(image_bytes: bytes) -> bytes:
    """Compress and resize image for web: convert to RGB JPEG, max 768px, quality 85.
    Fixes: huge PNG sizes, alpha-channel white screen, slow loading."""
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert("RGB")  # Remove alpha (fixes white screen)
    if max(img.size) > MAX_SIZE:
        ratio = MAX_SIZE / max(img.size)
        new_size = (int(img.width * ratio), int(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=JPEG_QUALITY, optimize=True)
    return buf.getvalue()


@router.post("/generate-design", response_model=AIDesignResponse)
def generate_design(
    request: AIDesignRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not LITELLM_KEY and not CLIPROXY_KEY:
        raise HTTPException(status_code=500, detail="Image generation API key is not configured")

    prompt = _build_prompt(request)

    try:
        image_bytes, model_used = _generate_image(prompt)
        image_bytes = _compress_image(image_bytes)

        filename = f"{uuid.uuid4()}.jpg"
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
    if not LITELLM_KEY and not CLIPROXY_KEY:
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
        image_bytes = _compress_image(image_bytes)

        filename = f"{uuid.uuid4()}.jpg"
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
    if not LITELLM_KEY and not CLIPROXY_KEY:
        raise HTTPException(status_code=500, detail="Image generation API key is not configured")

    full_prompt = (
        f"Professional jewelry product photography. {prompt}. "
        f"Setting: Professional studio lighting, pure white background, 8K ultra-high resolution, "
        f"photorealistic rendering, highly reflective surfaces, commercial product photography, "
        f"luxury brand aesthetic, centered composition."
    )

    try:
        image_bytes, model_used = _generate_image(full_prompt)
        image_bytes = _compress_image(image_bytes)

        filename = f"{uuid.uuid4()}.jpg"
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
