from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class StockAssessmentCreate(BaseModel):
    crop_id: str = Field(..., description="Crop identifier, e.g. 'tomato'")
    crop_name: str = Field(..., description="Crop name")
    category: Optional[str] = "vegetable"
    quantity_kg: float = Field(..., gt=0, description="Quantity in kilograms")
    unit: Optional[str] = "kg"
    unit_amount: Optional[float] = None
    storage_type: str = Field(..., description="'cold', 'ventilated', or 'open'")
    storage_cost_per_day: float = Field(default=0.0, ge=0)
    age_days: int = Field(default=0, ge=0)
    location_mandi: Optional[str] = "Dindigul Central Market Hub"
    current_mandi_price: float = Field(..., gt=0)
    decision: str = Field(..., description="'HOLD' or 'SELL'")
    target_date: Optional[str] = None
    optimal_days: Optional[int] = 0
    expected_net_revenue: Optional[float] = 0.0
    sell_now_net_revenue: Optional[float] = 0.0
    net_advantage: Optional[float] = 0.0
    expected_spoilage_kg: Optional[float] = 0.0
    confidence: Optional[str] = "HIGH"
    notes: Optional[str] = None
    status: Optional[str] = "Active"


class StockAssessmentResponse(StockAssessmentCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PnLRecordCreate(BaseModel):
    id: str
    date: str
    date_formatted: str
    month: str
    crop_id: str
    crop_name: str
    crop_emoji: Optional[str] = "📦"
    quantity_kg: float
    decision: str
    sold_date: Optional[str] = None
    target_date: Optional[str] = None
    initial_price: float = 0.0
    sold_price: float = 0.0
    storage_cost: float = 0.0
    spoilage_loss_kg: float = 0.0
    spoilage_avoided_kg: float = 0.0
    realized_net: float
    sell_now_net: float = 0.0
    profit_gain: float = 0.0
    gain_percent: float = 0.0
    status: Optional[str] = "Settled"


class PnLRecordResponse(PnLRecordCreate):
    created_at: datetime

    class Config:
        from_attributes = True


class PnLSummaryResponse(BaseModel):
    total_net_realized: float
    total_extra_gain: float
    total_spoilage_saved_kg: float
    total_quantity_kg: float
    total_lots: int


class UserProfileResponse(BaseModel):
    id: int
    name: str
    role: str
    organization: str
    member_id: str
    hub: str
    state: str
    phone: str
    kyc_status: str

    class Config:
        from_attributes = True
