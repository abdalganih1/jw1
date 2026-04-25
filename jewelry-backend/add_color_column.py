"""Add color column to products table"""
import sqlite3

DB_PATH = "jewelry.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Check if column already exists
cursor.execute("PRAGMA table_info(products)")
columns = [col[1] for col in cursor.fetchall()]

if 'color' not in columns:
    cursor.execute("ALTER TABLE products ADD COLUMN color VARCHAR(50)")
    print("✅ Added 'color' column to products table")
else:
    print("ℹ️  'color' column already exists")

conn.commit()
conn.close()