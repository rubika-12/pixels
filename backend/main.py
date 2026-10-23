import sys
import os
from pathlib import Path
from typing import List, Optional
from datetime import datetime

# Ensure backend directory is in python module search path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc, func, text

from database import get_db, test_database_connection
from config import get_raw_database_url, mask_database_url
from models import UserStockAssessment, PnLRecord, UserProfile
from schemas import (
    StockAssessmentCreate,
    StockAssessmentResponse,
    PnLRecordCreate,
    PnLRecordResponse,
    PnLSummaryResponse,
    UserProfileResponse,
)
from init_db import init_database

app = FastAPI(
    title="StoreOrSell Post-Harvest Advisor API",
    description="Production FastAPI backend connected to Neon PostgreSQL using SQLAlchemy and psycopg driver.",
    version="1.1.0",
)

# Enable CORS for frontend clients (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    """Ensure database schema and baseline records exist without destructive operations."""
    try:
        init_database()
    except Exception as exc:
        print(f"[!] Warning: Database init during startup failed: {exc}")


@app.get("/")
def read_root():
    """Root status endpoint."""
    return {
        "service": "StoreOrSell Backend API",
        "status": "online",
        "database_driver": "psycopg (SQLAlchemy)",
        "docs_url": "/docs",
    }


@app.get("/api/health")
def health_check():
    """Basic health check endpoint."""
    has_db_url = bool(get_raw_database_url())
    return {
        "status": "healthy",
        "database_url_configured": has_db_url,
    }


@app.get("/api/db/test-connection")
def api_test_db_connection():
    """
    Test database connectivity against Neon PostgreSQL.
    Runs a non-destructive 'SELECT 1' test query without altering any data.
    """
    result = test_database_connection()
    if not result.get("connected"):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=result,
        )
    return {
        "status": "success",
        "message": "Successfully connected to Neon PostgreSQL via SQLAlchemy + psycopg driver.",
        "details": result,
    }


# ==========================================
# USER PROFILE ENDPOINTS
# ==========================================

@app.get("/api/user-profile", response_model=UserProfileResponse)
def get_user_profile(db: Session = Depends(get_db)):
    """Retrieve logged-in farmer/trader profile details from Neon database."""
    profile = db.query(UserProfile).first()
    if not profile:
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
        db.refresh(profile)
    return profile


# ==========================================
# DYNAMIC USER STOCK ASSESSMENTS
# ==========================================

@app.get("/api/stock-assessments", response_model=List[StockAssessmentResponse])
def get_stock_assessments(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    """Retrieve user-submitted stock holdings and assessment records from Neon PostgreSQL."""
    query = db.query(UserStockAssessment).order_by(desc(UserStockAssessment.created_at))
    if status_filter:
        query = query.filter(UserStockAssessment.status == status_filter)
    return query.all()


@app.post("/api/stock-assessments", response_model=StockAssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_stock_assessment(assessment: StockAssessmentCreate, db: Session = Depends(get_db)):
    """
    Save a new dynamic user stock assessment to the Neon database.
    Validates crop type, quantity, storage condition, mandi location, and advice.
    """
    new_record = UserStockAssessment(
        crop_id=assessment.crop_id,
        crop_name=assessment.crop_name,
        category=assessment.category or "vegetable",
        quantity_kg=assessment.quantity_kg,
        unit=assessment.unit or "kg",
        unit_amount=assessment.unit_amount or assessment.quantity_kg,
        storage_type=assessment.storage_type,
        storage_cost_per_day=assessment.storage_cost_per_day,
        age_days=assessment.age_days,
        location_mandi=assessment.location_mandi or "Dindigul Central Market Hub",
        current_mandi_price=assessment.current_mandi_price,
        decision=assessment.decision,
        target_date=assessment.target_date,
        optimal_days=assessment.optimal_days,
        expected_net_revenue=assessment.expected_net_revenue,
        sell_now_net_revenue=assessment.sell_now_net_revenue,
        net_advantage=assessment.net_advantage,
        expected_spoilage_kg=assessment.expected_spoilage_kg,
        confidence=assessment.confidence or "HIGH",
        notes=assessment.notes,
        status=assessment.status or "Active",
        created_at=datetime.utcnow(),
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@app.delete("/api/stock-assessments/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stock_assessment(assessment_id: int, db: Session = Depends(get_db)):
    """Delete a stock assessment record by ID."""
    record = db.query(UserStockAssessment).filter(UserStockAssessment.id == assessment_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Stock assessment not found")
    db.delete(record)
    db.commit()
    return None


@app.post("/api/stock-assessments/{assessment_id}/mark-sold", response_model=PnLRecordResponse)
def mark_assessment_sold(
    assessment_id: int,
    sold_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """
    Mark an active stock assessment as Sold and record the realized transaction into pnl_records.
    """
    record = db.query(UserStockAssessment).filter(UserStockAssessment.id == assessment_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Stock assessment not found")
    
    record.status = "Sold"
    
    # Calculate realized net and profit gain
    actual_sold_price = sold_price if (sold_price and sold_price > 0) else (record.current_mandi_price + (record.net_advantage / max(1, record.quantity_kg)))
    gross_realized = (record.quantity_kg - (record.expected_spoilage_kg or 0)) * actual_sold_price
    storage_total = record.quantity_kg * record.storage_cost_per_day * record.optimal_days
    realized_net = gross_realized - storage_total
    sell_now_net = record.sell_now_net_revenue or (record.quantity_kg * record.current_mandi_price)
    profit_gain = realized_net - sell_now_net
    gain_pct = round((profit_gain / max(1, sell_now_net)) * 100, 1) if sell_now_net > 0 else 0.0

    now = datetime.utcnow()
    date_formatted = now.strftime("%d %b %Y")
    month_name = now.strftime("%B")

    tx_id = f"tx-usr-{record.id}-{int(now.timestamp())}"

    # Emojis for crops
    crop_emojis = {
        "tomato": "🍅", "onion": "🧅", "potato": "🥔", "green-chilli": "🌶️",
        "chilli": "🌶️", "cabbage": "🥬", "carrot": "🥕", "garlic": "🧄",
        "ginger": "🫚", "cauliflower": "🥦", "capsicum": "🫑", "banana": "🍌",
        "mango": "🥭", "apple": "🍎", "papaya": "🍈", "pomegranate": "🍎",
        "sweet-orange": "🍊", "grapes": "🍇", "watermelon": "🍉"
    }

    pnl_entry = PnLRecord(
        id=tx_id,
        date=now.strftime("%Y-%m-%d"),
        date_formatted=date_formatted,
        month=month_name,
        crop_id=record.crop_id,
        crop_name=record.crop_name,
        crop_emoji=crop_emojis.get(record.crop_id, "📦"),
        quantity_kg=record.quantity_kg,
        decision=record.decision,
        sold_date=now.strftime("%Y-%m-%d"),
        target_date=record.target_date or date_formatted,
        initial_price=record.current_mandi_price,
        sold_price=actual_sold_price,
        storage_cost=storage_total,
        spoilage_loss_kg=record.expected_spoilage_kg,
        spoilage_avoided_kg=max(0, record.quantity_kg * 0.15 - record.expected_spoilage_kg),
        realized_net=round(realized_net, 2),
        sell_now_net=round(sell_now_net, 2),
        profit_gain=round(profit_gain, 2),
        gain_percent=gain_pct,
        status="Settled",
        created_at=now,
    )
    db.add(pnl_entry)
    db.commit()
    db.refresh(pnl_entry)
    return pnl_entry


# ==========================================
# P&L STATEMENTS & PERFORMANCE REPORT
# ==========================================

@app.get("/api/pnl-records", response_model=List[PnLRecordResponse])
def get_pnl_records(
    month: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Retrieve P&L transaction records from Neon database with optional month filter."""
    query = db.query(PnLRecord).order_by(desc(PnLRecord.created_at))
    if month and month.lower() != "all":
        query = query.filter(func.lower(PnLRecord.month) == month.lower())
    return query.all()


@app.post("/api/pnl-records", response_model=PnLRecordResponse, status_code=status.HTTP_201_CREATED)
def create_pnl_record(record: PnLRecordCreate, db: Session = Depends(get_db)):
    """Add a new PnL transaction statement entry into Neon PostgreSQL."""
    pnl = PnLRecord(
        id=record.id,
        date=record.date,
        date_formatted=record.date_formatted,
        month=record.month,
        crop_id=record.crop_id,
        crop_name=record.crop_name,
        crop_emoji=record.crop_emoji or "📦",
        quantity_kg=record.quantity_kg,
        decision=record.decision,
        sold_date=record.sold_date,
        target_date=record.target_date,
        initial_price=record.initial_price,
        sold_price=record.sold_price,
        storage_cost=record.storage_cost,
        spoilage_loss_kg=record.spoilage_loss_kg,
        spoilage_avoided_kg=record.spoilage_avoided_kg,
        realized_net=record.realized_net,
        sell_now_net=record.sell_now_net,
        profit_gain=record.profit_gain,
        gain_percent=record.gain_percent,
        status=record.status or "Settled",
        created_at=datetime.utcnow(),
    )
    db.add(pnl)
    db.commit()
    db.refresh(pnl)
    return pnl


@app.get("/api/pnl-summary", response_model=PnLSummaryResponse)
def get_pnl_summary(
    month: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Compute aggregate P&L return totals dynamically from the Neon database."""
    query = db.query(PnLRecord)
    if month and month.lower() != "all":
        query = query.filter(func.lower(PnLRecord.month) == month.lower())
    records = query.all()

    total_net = sum(r.realized_net for r in records)
    total_gain = sum(r.profit_gain for r in records)
    total_spoilage = sum(r.spoilage_avoided_kg for r in records)
    total_qty = sum(r.quantity_kg for r in records)

    return {
        "total_net_realized": round(total_net, 2),
        "total_extra_gain": round(total_gain, 2),
        "total_spoilage_saved_kg": round(total_spoilage, 2),
        "total_quantity_kg": round(total_qty, 2),
        "total_lots": len(records),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
