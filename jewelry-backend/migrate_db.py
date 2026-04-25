import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL", "mysql+pymysql://root:@localhost:3306/jewelry_db"
)

parts = DATABASE_URL.replace("mysql+pymysql://", "").split("/")
db_name = parts[1].split("?")[0]
auth_host = parts[0]

if "@" in auth_host:
    user_pass, host_port = auth_host.rsplit("@", 1)
    if ":" in user_pass:
        db_user, db_pass = user_pass.split(":", 1)
    else:
        db_user, db_pass = user_pass, ""
else:
    db_user, db_pass, host_port = "root", "", auth_host

connection = pymysql.connect(
    host=host_port.split(":")[0],
    port=int(host_port.split(":")[1]) if ":" in host_port else 3306,
    user=db_user,
    password=db_pass,
    database=db_name,
)
cursor = connection.cursor()

migrations = [
    "ALTER TABLE user_generated_designs ADD COLUMN prompt_used TEXT NULL",
    "ALTER TABLE user_generated_designs ADD COLUMN model_used VARCHAR(100) NULL",
    "ALTER TABLE user_generated_designs ADD COLUMN is_favorite TINYINT(1) DEFAULT 0",
]

for sql in migrations:
    try:
        cursor.execute(sql)
        print(f"OK: {sql[:60]}...")
    except pymysql.err.OperationalError as e:
        if e.args[0] == 1060:
            print(f"SKIP (already exists): {sql[:60]}...")
        else:
            raise

connection.commit()
connection.close()
print("Migration complete!")
