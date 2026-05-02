import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import (
    User, UserRole, Jeweler, Category, PaymentMethod,
    Product, ProductImage,
)
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
            password=get_password_hash("admin"),
            first_name="المدير",
            last_name="العام",
            phone="+963 953 330 792",
            role=UserRole.ADMIN,
        )
        db.add(admin_user)
        db.flush()

        print("Seeding Admin Jeweler (same as admin)...")
        admin_jeweler = Jeweler(
            name="المدير الصائغ",
            shop_name="Vivelt Gold",
            bio="صائغ ومدير المتجر - تصميمات مجوهرات فاخرة",
            address="سوريا، حماة",
            phone="+963 953 330 792",
            email="admin@viveltgold.com",
            rating=5.0,
        )
        db.add(admin_jeweler)
        db.flush()

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
        for i in range(1, 6):
            db.add(User(
                username=f"user{i}",
                email=f"user{i}@example.com",
                password=get_password_hash("password123"),
                first_name=f"First{i}",
                last_name=f"Last{i}",
                phone=f"123456789{i}",
                role=UserRole.CUSTOMER,
            ))

        print("Seeding Payment Methods...")
        db.add_all([
            PaymentMethod(method_name="Credit Card"),
            PaymentMethod(method_name="Bank Transfer"),
            PaymentMethod(method_name="MADA"),
            PaymentMethod(method_name="Cash on Delivery"),
            PaymentMethod(method_name="Apple Pay"),
        ])

        print("Seeding Categories...")
        cat_rings = Category(name="Rings")
        cat_necklaces = Category(name="Necklaces")
        cat_bracelets = Category(name="Bracelets")
        cat_earrings = Category(name="Earrings")
        db.add_all([cat_rings, cat_necklaces, cat_bracelets, cat_earrings])
        db.flush()

        print("Seeding Products...")
        product_data = [
            {
                "name": "خاتم ذهب ملكي",
                "material": "gold",
                "karat": "18k",
                "weight": 5.2,
                "price": 4500,
                "stock": 8,
                "description": "خاتم ذهب عيار 18 بتصميم ملكي فاخر مرصع بالألماس",
                "color": "gold",
                "is_new": True,
                "is_bestseller": True,
                "is_featured": True,
                "category": cat_rings,
                "images": [
                    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
                    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800",
                    "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800",
                ],
            },
            {
                "name": "خاتم ذهب سوليتير",
                "material": "gold",
                "karat": "21k",
                "weight": 3.8,
                "price": 6200,
                "stock": 5,
                "description": "خاتم سوليتير ذهب عيار 21 بحجر ألماس أصلي",
                "color": "gold",
                "is_new": True,
                "is_bestseller": False,
                "is_featured": True,
                "category": cat_rings,
                "images": [
                    "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800",
                    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
                ],
            },
            {
                "name": "خاتم فضة أنيق",
                "material": "silver",
                "karat": "925",
                "weight": 4.0,
                "price": 850,
                "stock": 15,
                "description": "خاتم فضة عيار 925 بتصميم عصري أنيق",
                "color": "silver",
                "is_new": False,
                "is_bestseller": True,
                "is_featured": False,
                "category": cat_rings,
                "images": [
                    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
                    "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800",
                ],
            },
            {
                "name": "قلادة ذهب كلاسيك",
                "material": "gold",
                "karat": "18k",
                "weight": 12.5,
                "price": 7800,
                "stock": 3,
                "description": "قلادة ذهب كلاسيكية بتصميم راقي",
                "color": "gold",
                "is_new": True,
                "is_bestseller": True,
                "is_featured": True,
                "category": cat_necklaces,
                "images": [
                    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
                    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800",
                ],
            },
            {
                "name": "قلادة بلاتينيوم فاخرة",
                "material": "platinum",
                "karat": "950",
                "weight": 8.0,
                "price": 12000,
                "stock": 2,
                "description": "قلادة بلاتينيوم فاخرة مرصعة بالأحجار الكريمة",
                "color": "platinum",
                "is_new": True,
                "is_bestseller": False,
                "is_featured": True,
                "category": cat_necklaces,
                "images": [
                    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
                    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
                ],
            },
            {
                "name": "سوار ذهب رفيع",
                "material": "gold",
                "karat": "18k",
                "weight": 6.0,
                "price": 3200,
                "stock": 10,
                "description": "سوار ذهب رفيع أنيق مناسب للاستخدام اليومي",
                "color": "gold",
                "is_new": False,
                "is_bestseller": True,
                "is_featured": False,
                "category": cat_bracelets,
                "images": [
                    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
                    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800",
                ],
            },
            {
                "name": "سوار فضة عصري",
                "material": "silver",
                "karat": "925",
                "weight": 5.5,
                "price": 950,
                "stock": 12,
                "description": "سوار فضة بتصميم عصري مميز",
                "color": "silver",
                "is_new": True,
                "is_bestseller": False,
                "is_featured": False,
                "category": cat_bracelets,
                "images": [
                    "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800",
                    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
                ],
            },
            {
                "name": "أقراط ذهب لؤلؤ",
                "material": "gold",
                "karat": "18k",
                "weight": 3.2,
                "price": 2800,
                "stock": 7,
                "description": "أقراط ذهب مع لؤلؤ طبيعي بتصميم كلاسيكي",
                "color": "gold",
                "is_new": True,
                "is_bestseller": True,
                "is_featured": True,
                "category": cat_earrings,
                "images": [
                    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
                    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800",
                ],
            },
            {
                "name": "أقراط فضة مودرن",
                "material": "silver",
                "karat": "925",
                "weight": 2.8,
                "price": 680,
                "stock": 20,
                "description": "أقراط فضة بتصميم حديث وعصري",
                "color": "silver",
                "is_new": False,
                "is_bestseller": False,
                "is_featured": False,
                "category": cat_earrings,
                "images": [
                    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
                    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800",
                ],
            },
            {
                "name": "خاتم ذهب ورد",
                "material": "gold",
                "karat": "14k",
                "weight": 4.5,
                "price": 3500,
                "stock": 6,
                "description": "خاتم ذهب وردي عيار 14 بتصميم أنيق",
                "color": "rose-gold",
                "is_new": True,
                "is_bestseller": False,
                "is_featured": True,
                "category": cat_rings,
                "images": [
                    "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800",
                    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
                ],
            },
            {
                "name": "قلادة فضة مع أحجار",
                "material": "silver",
                "karat": "925",
                "weight": 7.0,
                "price": 1500,
                "stock": 9,
                "description": "قلادة فضة مرصعة بأحجار كريمة ملونة",
                "color": "silver",
                "is_new": True,
                "is_bestseller": True,
                "is_featured": True,
                "category": cat_necklaces,
                "images": [
                    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
                    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800",
                ],
            },
            {
                "name": "سوار ذهب سميك",
                "material": "gold",
                "karat": "21k",
                "weight": 15.0,
                "price": 9500,
                "stock": 4,
                "description": "سوار ذهب سميك عيار 21 للمناسبات الخاصة",
                "color": "gold",
                "is_new": False,
                "is_bestseller": True,
                "is_featured": True,
                "category": cat_bracelets,
                "images": [
                    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800",
                    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
                ],
            },
        ]

        for pd in product_data:
            p = Product(
                jeweler_id=admin_jeweler.id,
                name=pd["name"],
                material=pd["material"],
                karat=pd["karat"],
                weight=pd["weight"],
                price=pd["price"],
                stock_quantity=pd["stock"],
                description=pd["description"],
                image_path=pd["images"][0],
                color=pd["color"],
                is_new=pd["is_new"],
                is_bestseller=pd["is_bestseller"],
                is_featured=pd["is_featured"],
            )
            db.add(p)
            db.flush()

            p.categories.append(pd["category"])

            for idx, img_url in enumerate(pd["images"]):
                db.add(ProductImage(
                    product_id=p.id,
                    image_path=img_url,
                    display_order=idx,
                ))

        db.commit()
        print(f"Database seeding completed! {len(product_data)} products created.")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()