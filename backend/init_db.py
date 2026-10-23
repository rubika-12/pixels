"""
Database initialization and non-destructive schema creation for StoreOrSell.
Creates tables if they don't exist and seeds initial reference data if tables are empty.
Does NOT run destructive commands or drop any tables.
"""

import sys
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import select, func

BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))

from database import get_engine, Base, get_session_factory
from models import UserStockAssessment, PnLRecord, UserProfile


INITIAL_PNL_RECORDS = [
    {
        "id": "tx-101",
        "date": "2026-10-18",
        "date_formatted": "18 Oct 2026",
        "month": "October",
        "crop_id": "tomato",
        "crop_name": "Tomato",
        "crop_emoji": "🍅",
        "quantity_kg": 1000.0,
        "decision": "HOLD",
        "sold_date": "2026-10-23",
        "target_date": "23 Oct 2026",
        "initial_price": 18.0,
        "sold_price": 24.0,
        "storage_cost": 1500.0,
        "spoilage_loss_kg": 120.0,
        "spoilage_avoided_kg": 120.0,
        "realized_net": 19620.0,
        "sell_now_net": 18000.0,
        "profit_gain": 1620.0,
        "gain_percent": 9.0,
        "status": "Settled",
    },
    {
        "id": "tx-102",
        "date": "2026-10-12",
        "date_formatted": "12 Oct 2026",
        "month": "October",
        "crop_id": "onion",
        "crop_name": "Onion",
        "crop_emoji": "🧅",
        "quantity_kg": 4000.0,
        "decision": "SELL",
        "sold_date": "2026-10-12",
        "target_date": "12 Oct 2026",
        "initial_price": 24.0,
        "sold_price": 24.0,
        "storage_cost": 0.0,
        "spoilage_loss_kg": 0.0,
        "spoilage_avoided_kg": 320.0,
        "realized_net": 96000.0,
        "sell_now_net": 92600.0,
        "profit_gain": 3400.0,
        "gain_percent": 3.5,
        "status": "Settled",
    },
    {
        "id": "tx-103",
        "date": "2026-10-04",
        "date_formatted": "04 Oct 2026",
        "month": "October",
        "crop_id": "green-chilli",
        "crop_name": "Green Chilli",
        "crop_emoji": "🌶️",
        "quantity_kg": 500.0,
        "decision": "HOLD",
        "sold_date": "2026-10-08",
        "target_date": "08 Oct 2026",
        "initial_price": 42.0,
        "sold_price": 54.0,
        "storage_cost": 600.0,
        "spoilage_loss_kg": 35.0,
        "spoilage_avoided_kg": 45.0,
        "realized_net": 23400.0,
        "sell_now_net": 21000.0,
        "profit_gain": 2400.0,
        "gain_percent": 11.4,
        "status": "Settled",
    },
    {
        "id": "tx-104",
        "date": "2026-09-26",
        "date_formatted": "26 Sep 2026",
        "month": "September",
        "crop_id": "apple",
        "crop_name": "Apple (Shimla)",
        "crop_emoji": "🍎",
        "quantity_kg": 2000.0,
        "decision": "HOLD",
        "sold_date": "2026-10-03",
        "target_date": "03 Oct 2026",
        "initial_price": 110.0,
        "sold_price": 128.0,
        "storage_cost": 4000.0,
        "spoilage_loss_kg": 80.0,
        "spoilage_avoided_kg": 180.0,
        "realized_net": 242000.0,
        "sell_now_net": 220000.0,
        "profit_gain": 22000.0,
        "gain_percent": 10.0,
        "status": "Settled",
    },
    {
        "id": "tx-105",
        "date": "2026-09-17",
        "date_formatted": "17 Sep 2026",
        "month": "September",
        "crop_id": "potato",
        "crop_name": "Potato",
        "crop_emoji": "🥔",
        "quantity_kg": 5000.0,
        "decision": "HOLD",
        "sold_date": "2026-09-25",
        "target_date": "25 Sep 2026",
        "initial_price": 20.0,
        "sold_price": 23.5,
        "storage_cost": 3500.0,
        "spoilage_loss_kg": 150.0,
        "spoilage_avoided_kg": 350.0,
        "realized_net": 108500.0,
        "sell_now_net": 100000.0,
        "profit_gain": 8500.0,
        "gain_percent": 8.5,
        "status": "Settled",
    },
    {
        "id": "tx-106",
        "date": "2026-09-08",
        "date_formatted": "08 Sep 2026",
        "month": "September",
        "crop_id": "banana",
        "crop_name": "Banana (Robusta)",
        "crop_emoji": "🍌",
        "quantity_kg": 1200.0,
        "decision": "SELL",
        "sold_date": "2026-09-08",
        "target_date": "08 Sep 2026",
        "initial_price": 48.0,
        "sold_price": 48.0,
        "storage_cost": 0.0,
        "spoilage_loss_kg": 0.0,
        "spoilage_avoided_kg": 190.0,
        "realized_net": 56000.0,
        "sell_now_net": 51800.0,
        "profit_gain": 4200.0,
        "gain_percent": 11.7,
        "status": "Settled",
    },
    {
        "id": "tx-107",
        "date": "2026-08-28",
        "date_formatted": "28 Aug 2026",
        "month": "August",
        "crop_id": "mango",
        "crop_name": "Mango (Alphonso)",
        "crop_emoji": "🥭",
        "quantity_kg": 1500.0,
        "decision": "HOLD",
        "sold_date": "2026-09-03",
        "target_date": "03 Sep 2026",
        "initial_price": 65.0,
        "sold_price": 76.0,
        "storage_cost": 2800.0,
        "spoilage_loss_kg": 90.0,
        "spoilage_avoided_kg": 140.0,
        "realized_net": 105700.0,
        "sell_now_net": 97500.0,
        "profit_gain": 8200.0,
        "gain_percent": 8.4,
        "status": "Settled",
    },
    {
        "id": "tx-108",
        "date": "2026-08-14",
        "date_formatted": "14 Aug 2026",
        "month": "August",
        "crop_id": "garlic",
        "crop_name": "Garlic",
        "crop_emoji": "🧄",
        "quantity_kg": 800.0,
        "decision": "HOLD",
        "sold_date": "2026-08-24",
        "target_date": "24 Aug 2026",
        "initial_price": 130.0,
        "sold_price": 148.0,
        "storage_cost": 1600.0,
        "spoilage_loss_kg": 20.0,
        "spoilage_avoided_kg": 50.0,
        "realized_net": 112800.0,
        "sell_now_net": 104000.0,
        "profit_gain": 8800.0,
        "gain_percent": 8.5,
        "status": "Settled",
    },
]


def init_database():
    """
    Safely creates all database tables using SQLAlchemy Base.metadata.create_all().
    Only seeds baseline data if tables are empty.
    """
    engine = get_engine()
    print("[*] Creating PostgreSQL database tables if they do not exist...")
    Base.metadata.create_all(bind=engine)
    print("[+] Tables checked/created successfully.")

    session_factory = get_session_factory()
    with session_factory() as db:
        # Check User Profile
        profile_count = db.query(func.count(UserProfile.id)).scalar()
        if profile_count == 0:
            print("[*] Seeding default User Profile...")
            profile = UserProfile(
                name="Rohith L",
                role="FPO Trader & Member",
                organization="Pixel Punks FPO",
                member_id="FPO-TN-2026-884",
                hub="Dindigul & Oddanchatram Central Mandi Hub",
                state="Tamil Nadu",
                phone="+91 98421 73210",
                kyc_status="Verified Producer",
            )
            db.add(profile)
            db.commit()
            print("[+] Seeded default User Profile.")

        # Check PnL Records
        pnl_count = db.query(func.count(PnLRecord.id)).scalar()
        if pnl_count == 0:
            print(f"[*] Seeding {len(INITIAL_PNL_RECORDS)} baseline P&L statements...")
            for r in INITIAL_PNL_RECORDS:
                db.add(PnLRecord(**r))
            db.commit()
            print("[+] Baseline P&L statements seeded.")

        # Check initial sample stock assessment if empty
        stock_count = db.query(func.count(UserStockAssessment.id)).scalar()
        if stock_count == 0:
            print("[*] Seeding initial active stock lot...")
            sample_stock = UserStockAssessment(
                crop_id="tomato",
                crop_name="Tomato",
                category="vegetable",
                quantity_kg=1000.0,
                unit="kg",
                unit_amount=1000.0,
                storage_type="cold",
                storage_cost_per_day=0.30,
                age_days=2,
                location_mandi="Dindigul Central Market Hub",
                current_mandi_price=18.0,
                decision="HOLD",
                target_date="28 Oct (Hold +5d)",
                optimal_days=5,
                expected_net_revenue=19620.0,
                sell_now_net_revenue=18000.0,
                net_advantage=1620.0,
                expected_spoilage_kg=120.0,
                confidence="HIGH",
                notes="Initial cold room batch lot #TM-104",
                status="Active",
            )
            db.add(sample_stock)
            db.commit()
            print("[+] Initial active stock lot seeded.")

    print("[+] Database initialization complete.")


if __name__ == "__main__":
    init_database()
