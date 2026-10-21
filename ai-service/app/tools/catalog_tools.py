import requests
from typing import List, Dict, Any, Optional
from ..config import STRAPI_API_URL, STRAPI_PUBLIC_URL

# Fallback catalog data if Strapi is not yet reachable
FALLBACK_CARS = [
    {
        "id": 1,
        "title": "2020 Toyota Land Cruiser Prado TX-L",
        "make": "Toyota",
        "model": "Land Cruiser Prado",
        "year": 2020,
        "price": 7850000,
        "currency": "KES",
        "mileage": 42000,
        "transmission": "Automatic",
        "fuelType": "Diesel",
        "location": "Ngong Road Hub, Nairobi",
        "features": ["Sunroof", "Leather Seats", "4WD", "7 Seater", "Reverse Camera"],
    },
    {
        "id": 2,
        "title": "2018 Subaru Forester XT Eyesight",
        "make": "Subaru",
        "model": "Forester",
        "year": 2018,
        "price": 3150000,
        "currency": "KES",
        "mileage": 58000,
        "transmission": "Automatic",
        "fuelType": "Petrol",
        "location": "Kiambu Road Showroom, Nairobi",
        "features": ["EyeSight Assist", "AWD", "Heated Seats", "Turbocharged", "Roof Rails"],
    },
    {
        "id": 3,
        "title": "2021 Toyota Harrier Elegance",
        "make": "Toyota",
        "model": "Harrier",
        "year": 2021,
        "price": 4950000,
        "currency": "KES",
        "mileage": 31000,
        "transmission": "Automatic",
        "fuelType": "Petrol",
        "location": "Ngong Road Hub, Nairobi",
        "features": ["Wireless Charging", "LED Headlamps", "Power Tailgate", "JBL Audio"],
    },
    {
        "id": 4,
        "title": "2019 Mercedes-Benz C200 AMG Line",
        "make": "Mercedes-Benz",
        "model": "C-Class",
        "year": 2019,
        "price": 5400000,
        "currency": "KES",
        "mileage": 39000,
        "transmission": "Automatic",
        "fuelType": "Petrol",
        "location": "Westlands Executive Showroom, Nairobi",
        "features": ["AMG Styling", "Panoramic Sunroof", "Burmester Sound", "Ambient Lighting"],
    },
    {
        "id": 5,
        "title": "2022 Land Rover Defender 110 D300",
        "make": "Land Rover",
        "model": "Defender 110",
        "year": 2022,
        "price": 14500000,
        "currency": "KES",
        "mileage": 18500,
        "transmission": "Automatic",
        "fuelType": "Diesel",
        "location": "Westlands Executive Showroom, Nairobi",
        "features": ["Air Suspension", "360 Camera", "Meridian Sound", "ClearSight Rear View"],
    },
]

FALLBACK_PROPERTIES = [
    {
        "id": 1,
        "title": "4-Bedroom Luxury Villa with Pool in Karen",
        "propertyType": "Villa",
        "listingStatus": "For Sale",
        "price": 110000000,
        "currency": "KES",
        "bedrooms": 4,
        "bathrooms": 5,
        "suburb": "Karen",
        "county": "Nairobi",
        "amenities": ["Swimming Pool", "Staff Quarters", "Manicured Half-Acre Lawn", "Borehole"],
    },
    {
        "id": 2,
        "title": "Prime 1/2 Acre Red Soil Residential Plot",
        "propertyType": "Land/Plot",
        "listingStatus": "For Sale",
        "price": 18500000,
        "currency": "KES",
        "plotSizeAcres": 0.5,
        "titleType": "Freehold",
        "soilType": "Red Soil",
        "suburb": "Ruiru Mugutha",
        "county": "Kiambu",
        "amenities": ["Ready Title Deed", "Three-Phase Electricity", "Gated Controlled Community"],
    },
    {
        "id": 3,
        "title": "3-Bedroom Modern Apartment with Panoramic Views",
        "propertyType": "Apartment",
        "listingStatus": "For Rent",
        "price": 180000,
        "currency": "KES",
        "bedrooms": 3,
        "bathrooms": 3,
        "suburb": "Kilimani",
        "county": "Nairobi",
        "amenities": ["Rooftop Heated Pool", "High Speed Elevators", "Full Backup Generator", "Gym"],
    },
    {
        "id": 4,
        "title": "5-Bedroom Ambassadorial Mansion on 1 Acre",
        "propertyType": "Mansion",
        "listingStatus": "For Sale",
        "price": 165000000,
        "currency": "KES",
        "bedrooms": 5,
        "bathrooms": 6,
        "suburb": "Runda",
        "county": "Nairobi",
        "amenities": ["Private Tennis Court", "CCTV & Electric Fence", "UN Blue Zone Approved", "Wine Cellar"],
    },
]

def fetch_cars_from_cms() -> List[Dict[str, Any]]:
    for base in [STRAPI_API_URL, STRAPI_PUBLIC_URL]:
        try:
            resp = requests.get(f"{base}/api/cars", timeout=3)
            if resp.status_code == 200:
                data = resp.json().get("data", [])
                if data:
                    return [
                        {
                            "id": item.get("id"),
                            **item.get("attributes", {}),
                        }
                        for item in data
                    ]
        except Exception:
            continue
    return FALLBACK_CARS

def fetch_properties_from_cms() -> List[Dict[str, Any]]:
    for base in [STRAPI_API_URL, STRAPI_PUBLIC_URL]:
        try:
            resp = requests.get(f"{base}/api/properties", timeout=3)
            if resp.status_code == 200:
                data = resp.json().get("data", [])
                if data:
                    return [
                        {
                            "id": item.get("id"),
                            **item.get("attributes", {}),
                        }
                        for item in data
                    ]
        except Exception:
            continue
    return FALLBACK_PROPERTIES

def search_cars(query: str = "", max_price: Optional[float] = None) -> List[Dict[str, Any]]:
    cars = fetch_cars_from_cms()
    q = query.lower()
    filtered = []
    for c in cars:
        title = str(c.get("title", "")).lower()
        make = str(c.get("make", "")).lower()
        model = str(c.get("model", "")).lower()
        price = float(c.get("price", 0))

        if q and (q not in title and q not in make and q not in model):
            continue
        if max_price and price > max_price:
            continue
        filtered.append(c)
    return filtered or cars[:3]

def search_properties(query: str = "", max_price: Optional[float] = None) -> List[Dict[str, Any]]:
    props = fetch_properties_from_cms()
    q = query.lower()
    filtered = []
    for p in props:
        title = str(p.get("title", "")).lower()
        suburb = str(p.get("suburb", "")).lower()
        p_type = str(p.get("propertyType", "")).lower()
        price = float(p.get("price", 0))

        if q and (q not in title and q not in suburb and q not in p_type):
            continue
        if max_price and price > max_price:
            continue
        filtered.append(p)
    return filtered or props[:3]
