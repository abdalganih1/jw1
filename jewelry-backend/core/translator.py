"""Auto-translation service using Gemini API for product fields."""

import os
import logging
import requests

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={GEMINI_API_KEY}"


def translate_to_english(text: str) -> str:
    """Translate Arabic text to English using Gemini API.
    
    Returns the original text if translation fails.
    """
    if not text or not text.strip():
        return text
    
    # If already mostly English/numbers, return as-is
    latin_chars = sum(1 for c in text if c.isascii() and c.isalpha())
    total_alpha = sum(1 for c in text if c.isalpha())
    if total_alpha > 0 and latin_chars / total_alpha > 0.7:
        return text

    try:
        payload = {
            "contents": [{
                "parts": [{
                    "text": (
                        f"Translate the following Arabic text to English. "
                        f"Return ONLY the translation, nothing else. "
                        f"If the text is already in English, return it as-is.\n\n{text}"
                    )
                }]
            }],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 500,
            }
        }

        resp = requests.post(GEMINI_URL, json=payload, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        candidates = data.get("candidates", [])
        if candidates:
            translated = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
            if translated:
                return translated

        logger.warning(f"Gemini returned empty translation for: {text[:50]}")
        return text

    except Exception as e:
        logger.error(f"Translation failed: {e}")
        return text


def translate_product_fields(data: dict) -> dict:
    """Translate product fields from Arabic to English.
    
    Returns a dict with _en fields populated.
    """
    translations = {}
    
    # Only translate if _en field is not already provided
    if data.get("name") and not data.get("name_en"):
        translations["name_en"] = translate_to_english(data["name"])
    
    if data.get("description") and not data.get("description_en"):
        translations["description_en"] = translate_to_english(data["description"])
    
    if data.get("material") and not data.get("material_en"):
        translations["material_en"] = translate_to_english(data["material"])
    
    if data.get("color") and not data.get("color_en"):
        translations["color_en"] = translate_to_english(data["color"])

    return translations
