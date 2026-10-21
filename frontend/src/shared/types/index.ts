export type CarCondition = 'Foreign Used' | 'Locally Used' | 'Brand New' | 'In Transit';
export type CarTransmission = 'Automatic' | 'Manual';
export type CarFuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type CarBodyType = 'SUV' | 'Sedan' | 'Hatchback' | 'Pickup' | 'Station Wagon' | 'Coupe' | 'Van';
export type CarDriveType = '4WD' | 'AWD' | '2WD' | 'FWD' | 'RWD';
export type CarStatus = 'Available' | 'Reserved' | 'Sold';

export interface Car {
  id: string | number;
  title: string;
  slug: string;
  refNumber: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  price: number;
  currency: 'KES' | 'USD';
  mileage: number; // in kilometers
  engineCC: number;
  transmission: CarTransmission;
  fuelType: CarFuelType;
  bodyType: CarBodyType;
  driveType: CarDriveType;
  exteriorColor: string;
  interiorColor: string;
  condition: CarCondition;
  status: CarStatus;
  featured?: boolean;
  description: string;
  features: string[];
  images: string[];
  location: string;
  vin?: string;
}

export type PropertyType = 
  | 'Apartment' 
  | 'Villa' 
  | 'Townhouse' 
  | 'Mansion' 
  | 'Land/Plot' 
  | 'Commercial' 
  | 'Penthouse';

export type PropertyListingStatus = 'For Sale' | 'For Rent';
export type PropertyReadyStatus = 'Ready' | 'Under Construction' | 'Off-Plan';

export interface PropertyLocation {
  address: string;
  suburb: string;
  county: string;
  country: string;
}

export interface Property {
  id: string | number;
  title: string;
  slug: string;
  refNumber: string;
  propertyType: PropertyType;
  listingStatus: PropertyListingStatus;
  price: number;
  currency: 'KES' | 'USD';
  bedrooms?: number;
  bathrooms?: number;
  areaSqFt?: number;
  parkingSpaces?: number;
  location: PropertyLocation;
  amenities: string[];
  images: string[];
  featured?: boolean;
  readyStatus: PropertyReadyStatus;
  description: string;
}

export interface InquiryFormData {
  customerName: string;
  email: string;
  phone: string;
  message: string;
  preferredContact: 'whatsapp' | 'call' | 'email';
  inquiryType: 'car_purchase' | 'test_drive' | 'sell_car' | 'property_viewing' | 'property_inquiry';
  itemId?: string | number;
  itemTitle?: string;
}

export interface CarFilterState {
  make?: string;
  model?: string;
  bodyType?: string;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'newest';
}

export interface PropertyFilterState {
  propertyType?: string;
  listingStatus?: string;
  suburb?: string;
  minBedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest';
}
