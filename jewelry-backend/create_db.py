import pymysql
import os

try:
    connection = pymysql.connect(host='localhost', user='root', password='')
    cursor = connection.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS jewelry_db")
    print("Database jewelry_db created successfully!")
    connection.close()
except Exception as e:
    print(f"Error creating database: {e}")
