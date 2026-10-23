from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from database import Base


class UserStockAssessment(Base):
    """
    Stores actual user-submitted stock holdings, storage configurations,
    and the calculated Hold or Sell recommendation.
    """
    __tablename__ = "user_stock_assessments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    crop_id = Column(String(50), nullable=False, index=True)
    crop_name = Column(String(100), nullable=False)
    category = Column(String(50), default="vegetable")
    
    # Stock details
    quantity_kg = Column(Float, nullable=False)
    unit = Column(String(20), default="kg")
    unit_amount = Column(Float, nullable=True)
    storage_type = Column(String(50), nullable=False)
    storage_cost_per_day = Column(Float, default=0.0)
    age_days = Column(Integer, default=0)
    location_mandi = Column(String(150), default="Dindigul Central Market")
    current_mandi_price = Column(Float, nullable=False)
    
    # Recommendation results
    decision = Column(String(20), nullable=False)  # 'HOLD' or 'SELL'
    target_date = Column(String(50), nullable=True)
    optimal_days = Column(Integer, default=0)
    expected_net_revenue = Column(Float, default=0.0)
    sell_now_net_revenue = Column(Float, default=0.0)
    net_advantage = Column(Float, default=0.0)
    expected_spoilage_kg = Column(Float, default=0.0)
    confidence = Column(String(20), default="HIGH")
    
    # User notes & status
    notes = Column(Text, nullable=True)
    status = Column(String(30), default="Active")  # 'Active', 'Sold', 'Archived'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class PnLRecord(Base):
    """
    Historical and completed harvest lot transactions representing realized P&L statements.
    """
    __tablename__ = "pnl_records"

    id = Column(String(50), primary_key=True, index=True)
    date = Column(String(30), nullable=False)
    date_formatted = Column(String(50), nullable=False)
    month = Column(String(30), nullable=False, index=True)
    crop_id = Column(String(50), nullable=False)
    crop_name = Column(String(100), nullable=False)
    crop_emoji = Column(String(10), default="📦")
    
    quantity_kg = Column(Float, nullable=False)
    decision = Column(String(20), nullable=False)
    sold_date = Column(String(30), nullable=True)
    target_date = Column(String(50), nullable=True)
    
    initial_price = Column(Float, default=0.0)
    sold_price = Column(Float, default=0.0)
    storage_cost = Column(Float, default=0.0)
    spoilage_loss_kg = Column(Float, default=0.0)
    spoilage_avoided_kg = Column(Float, default=0.0)
    
    realized_net = Column(Float, nullable=False)
    sell_now_net = Column(Float, default=0.0)
    profit_gain = Column(Float, default=0.0)
    gain_percent = Column(Float, default=0.0)
    status = Column(String(30), default="Settled")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class UserProfile(Base):
    """
    User details for the logged-in FPO trader / farmer member.
    """
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    role = Column(String(100), default="FPO Trader & Member")
    organization = Column(String(150), default="Pixel Punks FPO")
    member_id = Column(String(50), default="FPO-TN-2026-884")
    hub = Column(String(150), default="Dindigul & Oddanchatram Central Mandi Hub")
    state = Column(String(50), default="Tamil Nadu")
    phone = Column(String(30), default="+91 98421 73210")
    kyc_status = Column(String(50), default="Verified Producer")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
