import math
from typing import Dict, Any

def calculate_car_finance(
    price: float,
    down_payment_pct: float = 20.0,
    tenure_months: int = 48,
    interest_annual_pct: float = 13.0,
) -> Dict[str, Any]:
    """
    Computes commercial bank car loan repayment in Kenya (KCB, Equity, Stanbic standards).
    """
    down_payment = (price * down_payment_pct) / 100.0
    loan_amount = price - down_payment
    monthly_rate = (interest_annual_pct / 100.0) / 12.0
    
    if monthly_rate == 0:
        monthly_repayment = loan_amount / tenure_months
    else:
        monthly_repayment = (
            loan_amount * (monthly_rate * math.pow(1 + monthly_rate, tenure_months))
        ) / (math.pow(1 + monthly_rate, tenure_months) - 1)

    total_payment = monthly_repayment * tenure_months
    total_interest = total_payment - loan_amount

    return {
        "price_kes": round(price),
        "down_payment_kes": round(down_payment),
        "down_payment_pct": down_payment_pct,
        "loan_amount_kes": round(loan_amount),
        "monthly_repayment_kes": round(monthly_repayment),
        "total_interest_kes": round(total_interest),
        "tenure_months": tenure_months,
        "interest_annual_pct": interest_annual_pct,
    }

def calculate_mortgage(
    property_price: float,
    down_payment_pct: float = 20.0,
    tenure_years: int = 15,
    interest_annual_pct: float = 14.0,
) -> Dict[str, Any]:
    """
    Computes residential/commercial property mortgage in Kenya (KMRC / CBK standards).
    """
    down_payment = (property_price * down_payment_pct) / 100.0
    loan_amount = property_price - down_payment
    tenure_months = tenure_years * 12
    monthly_rate = (interest_annual_pct / 100.0) / 12.0

    if monthly_rate == 0:
        monthly_repayment = loan_amount / tenure_months
    else:
        monthly_repayment = (
            loan_amount * (monthly_rate * math.pow(1 + monthly_rate, tenure_months))
        ) / (math.pow(1 + monthly_rate, tenure_months) - 1)

    total_payment = monthly_repayment * tenure_months
    total_interest = total_payment - loan_amount

    return {
        "property_price_kes": round(property_price),
        "down_payment_kes": round(down_payment),
        "down_payment_pct": down_payment_pct,
        "loan_amount_kes": round(loan_amount),
        "monthly_repayment_kes": round(monthly_repayment),
        "total_interest_kes": round(total_interest),
        "tenure_years": tenure_years,
        "interest_annual_pct": interest_annual_pct,
    }
