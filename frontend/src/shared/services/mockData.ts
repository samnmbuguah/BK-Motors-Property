import { Car, Property } from '../types';

export const MOCK_CARS: Car[] = [
  {
    id: 'car-1',
    title: '2020 Toyota Land Cruiser Prado TX-L',
    slug: '2020-toyota-land-cruiser-prado-tx-l',
    refNumber: 'BKM-101',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    year: 2020,
    trim: 'TX-L Package',
    price: 6850000,
    currency: 'KES',
    mileage: 41200,
    engineCC: 2800,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    bodyType: 'SUV',
    driveType: '4WD',
    exteriorColor: 'Pearl White',
    interiorColor: 'Beige Leather',
    condition: 'Foreign Used',
    status: 'Available',
    featured: true,
    description:
      'Immaculate condition foreign used Toyota Prado TX-L. Comes with 7-seater leather interior, sunroof, 360-degree camera, modelista body kit, lane keep assist, cruise control, push-to-start, and brand new Michelin tyres.',
    features: [
      'Sunroof',
      'Leather Seats',
      'Reverse Camera & 360 View',
      'Cruise Control',
      'Lane Keep Assist',
      'Dual Zone Climate Control',
      'Alloy Wheels',
      'Keyless Entry & Push Start',
      'Roof Rails',
      'Heated Seats'
    ],
    images: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    location: 'Nairobi Showroom (Ngong Road)',
  },
  {
    id: 'car-2',
    title: '2019 Subaru Forester 2.0i-L EyeSight',
    slug: '2019-subaru-forester-20i-l-eyesight',
    refNumber: 'BKM-102',
    make: 'Subaru',
    model: 'Forester',
    year: 2019,
    trim: '2.0i-L EyeSight',
    price: 3350000,
    currency: 'KES',
    mileage: 58000,
    engineCC: 2000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'SUV',
    driveType: 'AWD',
    exteriorColor: 'Dark Metallic Grey',
    interiorColor: 'Black Cloth/Leather',
    condition: 'Foreign Used',
    status: 'Available',
    featured: true,
    description:
      'Sporty, reliable, and equipped with Subaru Symmetrical AWD and EyeSight driver-assist safety technology. X-Mode for off-road performance, paddle shifters, and power tailgate.',
    features: [
      'Subaru EyeSight System',
      'Symmetrical AWD',
      'X-Mode Selector',
      'Power Tailgate',
      'Paddle Shifters',
      'Apple CarPlay & Android Auto',
      'LED Headlamps'
    ],
    images: [
      'https://images.unsplash.com/photo-1626077395066-50800dc05bfa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    location: 'Nairobi Showroom (Kiambu Road)',
  },
  {
    id: 'car-3',
    title: '2018 Mercedes-Benz C200 AMG Line',
    slug: '2018-mercedes-benz-c200-amg-line',
    refNumber: 'BKM-103',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2018,
    trim: 'C200 AMG Line',
    price: 4400000,
    currency: 'KES',
    mileage: 46000,
    engineCC: 1500,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sedan',
    driveType: 'RWD',
    exteriorColor: 'Obsidian Black',
    interiorColor: 'Cranberry Red Leather',
    condition: 'Foreign Used',
    status: 'Available',
    featured: true,
    description:
      'Stunning AMG Line styling, diamond radiator grille, panoramic sliding glass roof, Burmester surround sound system, ambient lighting package with 64 colors, and digital cockpit display.',
    features: [
      'AMG Styling Package',
      'Panoramic Sunroof',
      'Burmester Sound System',
      '64-Color Ambient Lighting',
      'Digital Cockpit',
      'Active Brake Assist',
      '19-inch AMG Multi-Spoke Alloys'
    ],
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    ],
    location: 'Nairobi Showroom (Ngong Road)',
  },
  {
    id: 'car-4',
    title: '2021 Toyota Hilux GD-6 2.8 Double Cab 4x4',
    slug: '2021-toyota-hilux-gd-6-double-cab',
    refNumber: 'BKM-104',
    make: 'Toyota',
    model: 'Hilux',
    year: 2021,
    trim: 'GD-6 Legend 50',
    price: 5900000,
    currency: 'KES',
    mileage: 34000,
    engineCC: 2800,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    bodyType: 'Pickup',
    driveType: '4WD',
    exteriorColor: 'Silver Metallic',
    interiorColor: 'Black Leather',
    condition: 'Locally Used',
    status: 'Available',
    featured: false,
    description:
      'High-performance 2.8L diesel workhorse with immaculate maintenance records. Fitted with snorkel, canopy, tow bar, bullbar with winch mount, and off-road BF Goodrich tires.',
    features: [
      'Selectable 4WD with Diff Lock',
      'Off-Road Canopy & Tow Hitch',
      'Snorkel & Front Bullbar',
      'Touchscreen Infotainment',
      'Side Steps',
      'Tough Bedliner'
    ],
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80'
    ],
    location: 'Mombasa Road Branch',
  },
  {
    id: 'car-5',
    title: '2019 Mazda CX-5 2.2D Exclusive-Mode',
    slug: '2019-mazda-cx5-exclusive-mode',
    refNumber: 'BKM-105',
    make: 'Mazda',
    model: 'CX-5',
    year: 2019,
    trim: 'Exclusive-Mode Package',
    price: 3450000,
    currency: 'KES',
    mileage: 52000,
    engineCC: 2200,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    bodyType: 'SUV',
    driveType: 'AWD',
    exteriorColor: 'Soul Red Crystal',
    interiorColor: 'Nappa Brown Leather',
    condition: 'Foreign Used',
    status: 'Available',
    featured: true,
    description:
      'Mazda flagship Soul Red Crystal exterior paired with Nappa leather. Heads-up display, Bose audio, heated and ventilated front seats, and adaptive cruise control.',
    features: [
      'Bose Premium 10-Speaker Audio',
      'Heads-Up Display (HUD)',
      'Nappa Leather with Cooling Seats',
      'Sunroof',
      'Radar Cruise Control',
      'Power Tailgate'
    ],
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'
    ],
    location: 'Nairobi Showroom (Kiambu Road)',
  },
  {
    id: 'car-6',
    title: '2017 Land Rover Range Rover Sport SDV6 HSE',
    slug: '2017-range-rover-sport-sdv6-hse',
    refNumber: 'BKM-106',
    make: 'Land Rover',
    model: 'Range Rover Sport',
    year: 2017,
    trim: 'SDV6 HSE Dynamic',
    price: 7800000,
    currency: 'KES',
    mileage: 63000,
    engineCC: 3000,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    bodyType: 'SUV',
    driveType: '4WD',
    exteriorColor: 'Santorini Black',
    interiorColor: 'Tan Windsor Leather',
    condition: 'Foreign Used',
    status: 'Available',
    featured: false,
    description:
      'True British luxury SUV. Adaptive air suspension, Meridian audio, panoramic roof, soft-close doors, Brembo brakes, deployable side steps, and Terrain Response 2.',
    features: [
      'Air Suspension',
      'Meridian 825W Surround Sound',
      'Deployable Side Steps',
      'Soft-Close Doors',
      'Terrain Response 2',
      'Panoramic Roof'
    ],
    images: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80'
    ],
    location: 'Nairobi Showroom (Ngong Road)',
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Luxury 4-Bedroom All-Ensuite Villa with Private Pool',
    slug: 'luxury-4-bedroom-villa-karen',
    refNumber: 'BKP-201',
    propertyType: 'Villa',
    listingStatus: 'For Sale',
    price: 95000000,
    currency: 'KES',
    bedrooms: 4,
    bathrooms: 5,
    areaSqFt: 5800,
    parkingSpaces: 4,
    location: {
      address: 'Miotoni Road, Karen',
      suburb: 'Karen',
      county: 'Nairobi',
      country: 'Kenya'
    },
    amenities: [
      'Private Swimming Pool',
      'Landscaped Mature Half-Acre Garden',
      'Backup Generator (Full)',
      'Solar Water Heating',
      'Borehole Water Supply',
      'Staff Quarters (DSQ for 2)',
      'Electric Perimeter Fence & CCTV',
      'Modern Fitted Kitchen with Island'
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    readyStatus: 'Ready',
    description:
      'Set within an exclusive gated sanctuary in Karen, this magnificent architectural villa seamlessly blends modern open-plan grandeur with serene outdoor living. Featuring double-height ceilings, a designer European kitchen, spacious family lounge, home cinema room, and expansive covered terrace overlooking the swimming pool.'
  },
  {
    id: 'prop-2',
    title: 'Ultra-Modern 3-Bedroom Penthouse with Panoramic City Views',
    slug: 'modern-3-bedroom-penthouse-kilimani',
    refNumber: 'BKP-202',
    propertyType: 'Penthouse',
    listingStatus: 'For Sale',
    price: 32000000,
    currency: 'KES',
    bedrooms: 3,
    bathrooms: 3.5,
    areaSqFt: 2850,
    parkingSpaces: 2,
    location: {
      address: 'Dennis Pritt Road, Kilimani',
      suburb: 'Kilimani',
      county: 'Nairobi',
      country: 'Kenya'
    },
    amenities: [
      'Rooftop Infinity Pool & Sky Lounge',
      'Fully Equipped Fitness Gym',
      'High-Speed Panoramic Elevators',
      'Full Borehole & Solar Backup',
      'Intercom & Biometric Access',
      'Expansive Wrap-Around Balcony'
    ],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    readyStatus: 'Ready',
    description:
      'Perched on the top floor overlooking the Nairobi skyline, this penthouse offers the ultimate cosmopolitan lifestyle. Floor-to-ceiling acoustic glass, Italian imported sanitary ware, smart lighting control, and access to a 5-star rooftop residents club.'
  },
  {
    id: 'prop-3',
    title: 'Executive 2-Bedroom Furnished Apartment for Rent',
    slug: 'executive-2-bedroom-furnished-westlands',
    refNumber: 'BKP-203',
    propertyType: 'Apartment',
    listingStatus: 'For Rent',
    price: 180000,
    currency: 'KES',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1400,
    parkingSpaces: 1,
    location: {
      address: 'General Mathenge Drive, Westlands',
      suburb: 'Westlands',
      county: 'Nairobi',
      country: 'Kenya'
    },
    amenities: [
      'Designer Furnishings Included',
      'Heated Indoor Pool',
      'High-Speed Fibre Internet Ready',
      'Cafe & Resident Lounge Onsite',
      '24/7 Concierge Desk',
      'Underground Secure Parking'
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    readyStatus: 'Ready',
    description:
      'Impeccably furnished apartment located on prestigious General Mathenge Drive. Walking distance to Sarit Centre and Westgate mall. Ideal for expatriates and corporate executives seeking turnkey luxury.'
  },
  {
    id: 'prop-4',
    title: 'Prime 0.75-Acre Commercial Redevelopment Land',
    slug: 'prime-land-ngong-road',
    refNumber: 'BKP-204',
    propertyType: 'Land/Plot',
    listingStatus: 'For Sale',
    price: 140000000,
    currency: 'KES',
    areaSqFt: 32670,
    location: {
      address: 'Main Ngong Road frontage',
      suburb: 'Ngong Road',
      county: 'Nairobi',
      country: 'Kenya'
    },
    amenities: [
      'Direct Highway Frontage',
      'Clean Freehold Title Deed',
      'Zoned for Mixed-Use High Rise Development',
      'Connected to Sewer and 3-Phase Electricity',
      'High Pedestrian & Vehicular Traffic'
    ],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    readyStatus: 'Ready',
    description:
      'Exceptional development plot with 45 meters of direct dual-carriageway frontage along Ngong Road. Perfect for commercial office towers, mixed-use retail & residential complex, or medical facility.'
  }
];
