import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost:3306/jewelry_db")
url = DATABASE_URL.replace("mysql+pymysql://", "")
user_pass, rest = url.split("@")
user, password = user_pass.split(":") if ":" in user_pass else (user_pass, "")
host_port, db_name = rest.split("/")
host, port = host_port.split(":") if ":" in host_port else (host_port, 3306)

try:
    conn = pymysql.connect(host=host, port=int(port), user=user, password=password, database=db_name)
    with conn.cursor() as cursor:
        cursor.execute("SELECT id, name FROM jewelers")
        jewelers = cursor.fetchall()
        print(f"Total jewelers: {len(jewelers)}")
        for j in jewelers:
            print(j)
finally:
    if 'conn' in locals(): conn.close()
