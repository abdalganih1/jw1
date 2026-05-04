"""Translate all existing products that don't have English translations."""

import sys
sys.path.insert(0, '/root/.openclaw/workspace/jw1/jewelry-backend')

from database import SessionLocal
from models import Product
from core.translator import translate_to_english
import time

db = SessionLocal()
products = db.query(Product).filter(Product.name_en == None).all()
print(f"Found {len(products)} products to translate")

for i, p in enumerate(products):
    print(f"[{i+1}/{len(products)}] Translating product {p.id}: {p.name[:40]}...")
    
    if p.name and not p.name_en:
        p.name_en = translate_to_english(p.name)
        print(f"  name_en: {p.name_en}")
    
    if p.description and not p.description_en:
        p.description_en = translate_to_english(p.description)
        print(f"  description_en: {p.description_en[:60]}...")
    
    if p.material and not p.material_en:
        p.material_en = translate_to_english(p.material)
    
    if p.color and not p.color_en:
        p.color_en = translate_to_english(p.color)
    
    db.commit()
    time.sleep(0.5)

print("Done! All products translated.")
db.close()
