import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User, UserRole, Jeweler, Category, PaymentMethod
from core.security import get_password_hash

os.makedirs(os.path.join("static", "product_images"), exist_ok=True)

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"
ADMIN_EMAIL = "admin@luxejewelry.com"


def seed_data():
    db: Session = SessionLocal()
    try:
        _seed_admin_user(db)
        _seed_jewelers(db)
        _seed_categories(db)
        _seed_payment_methods(db)
        db.commit()
        print("\nSeed complete!")
    except Exception as e:
        print("Error: {}".format(e))
        db.rollback()
    finally:
        db.close()


def _seed_admin_user(db: Session):
    from sqlalchemy import func as sa_func

    existing = db.query(User).filter(User.username == ADMIN_USERNAME).first()
    if existing:
        print(
            "SKIP: Admin user '{}' already exists (id={})".format(
                ADMIN_USERNAME, existing.id
            )
        )
        return
    admin = User(
        username=ADMIN_USERNAME,
        email=ADMIN_EMAIL,
        password=get_password_hash(ADMIN_PASSWORD),
        first_name="مدير",
        last_name="النظام",
        phone="0000000000",
        role=UserRole.ADMIN,
    )
    db.add(admin)
    db.flush()
    print(
        "OK: Admin user created (username={}, password={}, role=ADMIN, id={})".format(
            ADMIN_USERNAME, ADMIN_PASSWORD, admin.id
        )
    )


def _seed_jewelers(db: Session):
    existing = db.query(Jeweler).first()
    if existing:
        print("SKIP: Jeweler already exists (id={})".format(existing.id))
        return
    jeweler = Jeweler(
        name="Vivelt Gold",
        shop_name="Vivelt Gold Store",
        bio="Luxury jewelry store with AI-powered design.",
        address="Syria, Hama",
        phone="+963 953 330 792",
        email="jewellerystory@gmail.com",
        rating=5.0,
    )
    db.add(jeweler)
    db.flush()
    print("OK: Default jeweler created (id={})".format(jeweler.id))


def _seed_categories(db: Session):
    default_categories = ["Rings", "Necklaces", "Bracelets", "Earrings"]
    existing_cats = {c.name for c in db.query(Category).all()}
    for cat_name in default_categories:
        if cat_name not in existing_cats:
            db.add(Category(name=cat_name))
            print("OK: Category '{}' created".format(cat_name))
        else:
            print("SKIP: Category '{}' already exists".format(cat_name))


def _seed_payment_methods(db: Session):
    required_methods = [
        ("Credit Card", True),
        ("Bank Transfer", True),
        ("MADA", True),
        ("Cash on Delivery", True),
        ("Apple Pay", True),
    ]
    existing = {pm.method_name for pm in db.query(PaymentMethod).all()}
    for name, active in required_methods:
        if name not in existing:
            db.add(PaymentMethod(method_name=name, is_active=active))
            print("OK: Payment method '{}' created".format(name))
        else:
            print("SKIP: Payment method '{}' already exists".format(name))


if __name__ == "__main__":
    seed_data()
