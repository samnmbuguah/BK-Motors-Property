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

  // Land / Plot specific attributes
  plotSizeAcres?: number;
  plotDimensions?: string; // e.g. "50 x 100 ft", "1/4 Acre", "1 Acre"
  titleType?: 'Freehold' | 'Leasehold (99 Yrs)' | 'Leasehold (50 Yrs)' | 'Sectional Title';
  zoning?: 'Residential' | 'Commercial' | 'Agricultural' | 'Mixed-Use High Rise';
  soilType?: 'Red Soil' | 'Black Cotton' | 'Sandy Loam';
  topography?: 'Flat' | 'Gentle Slope' | 'Valley View';

  // Rental specific attributes
  furnishingStatus?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  serviceChargeMonthly?: number;
  serviceChargeInclusive?: boolean;
  depositTerms?: string;
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
  landSizeCategory?: string;
  titleType?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest';
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export type InquiryStatus = 'new' | 'in_progress' | 'contacted' | 'closed';

export interface InquiryItem {
  id: number | string;
  customerName: string;
  phone: string;
  email?: string;
  message: string;
  preferredContact: 'whatsapp' | 'call' | 'email';
  inquiryType: 'car_purchase' | 'test_drive' | 'sell_car' | 'property_viewing' | 'property_inquiry';
  itemId?: string;
  itemTitle?: string;
  status: InquiryStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type DocumentType =
  | 'logbook'
  | 'title_deed'
  | 'sales_agreement'
  | 'inspection_certificate'
  | 'id_copy'
  | 'payment_receipt';

export interface DealDocument {
  id: string;
  name: string;
  type: DocumentType;
  fileUrl: string;
  fileSize: string;
  verified: boolean;
  verificationNotes?: string;
  uploadedAt: string;
  itemTitle?: string;
}

export type TransactionStatus = 'pending' | 'cleared' | 'held_in_escrow' | 'disbursed';
export type TransactionType =
  | 'booking_deposit'
  | 'escrow_hold'
  | 'bank_financing_disbursement'
  | 'seller_final_payout';

export interface PaymentTransaction {
  id: string;
  reference: string;
  dealTitle: string;
  amount: number;
  currency: 'KES' | 'USD';
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod: 'M-PESA Paybill' | 'RTGS Bank Wire' | 'KCB Escrow' | 'Stanbic Asset Finance';
  payerName: string;
  recipientName: string;
  timestamp: string;
  receiptRef?: string;
}

export interface DealerConsignment {
  id: string;
  title: string;
  itemType: 'vehicle' | 'property';
  askingPrice: number;
  currency: 'KES' | 'USD';
  status:
    | 'pending_inspection'
    | 'inspected_verified'
    | 'live_on_showroom'
    | 'sale_in_progress'
    | 'sold_paid';
  photos: string[];
  documents: DealDocument[];
  transactions: PaymentTransaction[];
  inspectionScore?: string;
  createdAt: string;
}

