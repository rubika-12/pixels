"""
CLI Database Connectivity Test for StoreOrSell backend.
Tests connection to Neon PostgreSQL using SQLAlchemy and the psycopg driver.
"""

import sys
import os
from pathlib import Path

# Add backend directory to sys.path so modules can be imported
BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))

from config import get_raw_database_url, get_sqlalchemy_database_url, mask_database_url, ENV_PATH
from database import test_database_connection


def main():
    print("=" * 65)
    print(" StoreOrSell - Neon PostgreSQL Connectivity Verification")
    print("=" * 65)
    print(f"[*] Environment file: {ENV_PATH}")
    print(f"[*] File exists: {ENV_PATH.exists()}")

    raw_url = get_raw_database_url()

    if not raw_url:
        print("\n[!] STATUS: DATABASE_URL is NOT configured.")
        print("-" * 65)
        print("HOW TO CONFIGURE YOUR NEON DATABASE:")
        print("1. Log in to your Neon Console: https://console.neon.tech")
        print("2. Open your project dashboard (e.g., 'neondb').")
        print("3. In the 'Connection Details' widget, select:")
        print("     - Branch: main")
        print("     - Database: neondb (or your database)")
        print("     - Role: [your username]")
        print("     - Dialect: 'SQLAlchemy' or 'PostgreSQL'")
        print("4. Copy the connection string. It looks like:")
        print("   postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require")
        print("5. Open the file:")
        print(f"   {ENV_PATH}")
        print("6. Paste your connection string:")
        print('   DATABASE_URL="postgresql+psycopg://username:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require"')
        print("7. Re-run this test script:")
        print("   python backend/test_connection.py")
        print("-" * 65)
        return 1

    formatted_url = get_sqlalchemy_database_url()
    masked = mask_database_url(formatted_url)
    print(f"[*] Configured Connection URL (masked): {masked}")
    print("[*] Driver: psycopg (SQLAlchemy psycopg3 dialect)")
    print("[*] Testing live connection to Neon PostgreSQL...")

    result = test_database_connection()

    if result.get("connected"):
        print("\n[+] SUCCESS: Successfully connected to Neon PostgreSQL!")
        print("-" * 65)
        print(f"    - Database Name   : {result.get('database_name')}")
        print(f"    - Server Time (DB): {result.get('server_time')}")
        print(f"    - PostgreSQL Ver  : {result.get('postgres_version')}")
        print(f"    - Connection Mode : SSL Required (Neon Serverless)")
        print(f"    - Driver          : {result.get('driver')}")
        print("-" * 65)
        print("[+] Non-destructive test query ('SELECT 1') completed cleanly.")
        return 0
    else:
        print("\n[-] CONNECTION FAILED:")
        print("-" * 65)
        print(f"    Error: {result.get('error')}")
        if result.get("instructions"):
            print(f"    Tip  : {result.get('instructions')}")
        print("-" * 65)
        return 1


if __name__ == "__main__":
    sys.exit(main())
