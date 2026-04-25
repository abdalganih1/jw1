from sqlalchemy import create_engine, MetaData, Table, Column, Boolean
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./jewelry.db")
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Reflect the products table
metadata.reflect(bind=engine)
products_table = Table('products', metadata, autoload_with=engine)

# Add columns one by one
def add_column(table_name, column):
    try:
        column_name = column.compile(dialect=engine.dialect)
        column_type = column.type.compile(engine.dialect)
        engine.execute(f'ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}')
        print(f"Added {column.name} successfully.")
    except Exception as e:
        print(f"Error adding {column.name}: {e}")

with engine.connect() as conn:
    try:
        conn.execute("ALTER TABLE products ADD COLUMN is_new BOOLEAN DEFAULT 1")
    except Exception as e: print(e)
    try:
        conn.execute("ALTER TABLE products ADD COLUMN is_bestseller BOOLEAN DEFAULT 0")
    except Exception as e: print(e)
    try:
        conn.execute("ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT 0")
    except Exception as e: print(e)

print("Migration completed.")