import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User, UserRole, Jeweler, Category, PaymentMethod, Product
from core.security import get_password_hash


def seed_database():
    print("Clearing database...")
    Base.metadata.drop_all(bind=engine)
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        print("Seeding Admin User...")
        admin_user = User(
            username="admin",
            email="admin@viveltgold.com",
            password=get_password_hash(
                os.getenv("ADMIN_DEFAULT_PASSWORD", "admin")
            ),
            first_name="المدير",
            last_name="العام",
            phone="0500000001",
            role=UserRole.ADMIN,
        )
        db.add(admin_user)

        print("Seeding Customer User...")
        customer_user = User(
            username="customer1",
            email="customer1@example.com",
            password=get_password_hash("Customer@123"),
            first_name="أحمد",
            last_name="الخالد",
            phone="0500000002",
            role=UserRole.CUSTOMER,
        )
        db.add(customer_user)

        print("Seeding Users...")
        users = []
        for i in range(1, 6):
            user = User(
                username=f"user{i}",
                email=f"user{i}@example.com",
                password=get_password_hash("password123"),
                first_name=f"First{i}",
                last_name=f"Last{i}",
                phone=f"123456789{i}",
                role=UserRole.CUSTOMER,
            )
            users.append(user)
            db.add(user)

        print("Seeding Jewelers...")
        jewelers = []
        for i in range(1, 4):
            jeweler = Jeweler(
                name=f"Admin Jeweler {i}",
                shop_name=f"Luxury Shop {i}",
                bio="Exclusive luxury jewelry designs.",
                address=f"Dubai Mall, Shop {i}",
                phone=f"987654321{i}",
                email=f"jeweler{i}@example.com",
                rating=4.9,
            )
            jewelers.append(jeweler)
            db.add(jeweler)

        print("Seeding Payment Methods...")
        pm1 = PaymentMethod(method_name="Credit Card")
        pm2 = PaymentMethod(
            method_name="Bank Transfer",
            qr_code_image="/static/qr_dummy.png",
            notes="Transfer to IBAN SA123456789",
        )
        db.add_all([pm1, pm2])

        print("Seeding Categories...")
        cat1 = Category(name="Rings")
        cat2 = Category(name="Necklaces")
        cat3 = Category(name="Earrings")
        db.add_all([cat1, cat2, cat3])
        db.commit()

        print("Seeding Products...")
        products = [
            Product(
                jeweler_id=jewelers[0].id,
                name="Diamond Engagement Ring",
                material="Gold",
                karat="18k",
                price=5000.0,
                stock_quantity=5,
                description="Beautiful engagement ring.",
                image_path="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
            ),
            Product(
                jeweler_id=jewelers[1].id,
                name="Ruby Crown Necklace",
                material="Platinum",
                karat="21k",
                price=8500.0,
                stock_quantity=2,
                description="Royal ruby necklace.",
                image_path="https://images.unsplash.com/photo-1599643478524-fb66f7f2b904?w=800",
            ),
            Product(
                jeweler_id=jewelers[0].id,
                name="Sapphire Tear Earrings",
                material="Silver",
                karat="925",
                price=1200.0,
                stock_quantity=10,
                description="Elegant sapphire earrings.",
                image_path="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
            ),
        ]

        for p in products:
            db.add(p)

        db.commit()

        products[0].categories.append(cat1)
        products[1].categories.append(cat2)
        products[2].categories.append(cat3)

        db.commit()
        print("Database seeding completed securely!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
