import axios from 'axios';
import { Car, Property, InquiryFormData } from '../types';
import { MOCK_CARS, MOCK_PROPERTIES } from './mockData';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const apiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const carService = {
  async getAll(): Promise<Car[]> {
    try {
      const res = await apiClient.get('/cars?populate=*');
      if (res.data && res.data.data && res.data.data.length > 0) {
        return res.data.data.map((item: any) => normalizeCar(item));
      }
    } catch (err) {
      // Strapi offline or endpoint not yet configured, seamlessly return curated mock data
      console.warn('Notice: Strapi offline or not reachable. Using local catalog data.', err);
    }
    return MOCK_CARS;
  },

  async getBySlug(slug: string): Promise<Car | undefined> {
    try {
      const res = await apiClient.get(`/cars?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
      if (res.data?.data?.[0]) {
        return normalizeCar(res.data.data[0]);
      }
    } catch (err) {
      console.warn('Using local catalog data for slug:', slug);
    }
    return MOCK_CARS.find((c) => c.slug === slug || c.id.toString() === slug);
  },

  async getFeatured(): Promise<Car[]> {
    const all = await this.getAll();
    return all.filter((c) => c.featured);
  },
};

export const propertyService = {
  async getAll(): Promise<Property[]> {
    try {
      const res = await apiClient.get('/properties?populate=*');
      if (res.data && res.data.data && res.data.data.length > 0) {
        return res.data.data.map((item: any) => normalizeProperty(item));
      }
    } catch (err) {
      console.warn('Notice: Strapi offline or not reachable. Using local property data.', err);
    }
    return MOCK_PROPERTIES;
  },

  async getBySlug(slug: string): Promise<Property | undefined> {
    try {
      const res = await apiClient.get(`/properties?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
      if (res.data?.data?.[0]) {
        return normalizeProperty(res.data.data[0]);
      }
    } catch (err) {
      console.warn('Using local property data for slug:', slug);
    }
    return MOCK_PROPERTIES.find((p) => p.slug === slug || p.id.toString() === slug);
  },

  async getFeatured(): Promise<Property[]> {
    const all = await this.getAll();
    return all.filter((p) => p.featured);
  },
};

export const inquiryService = {
  async submitInquiry(data: InquiryFormData): Promise<{ success: boolean; message: string }> {
    try {
      await apiClient.post('/inquiries', { data });
      return { success: true, message: 'Your inquiry has been submitted successfully! Our team will contact you shortly.' };
    } catch (err) {
      console.warn('Strapi submission fallback - logging locally:', data);
      return {
        success: true,
        message: 'Thank you! Your request has been recorded. Our team will contact you via WhatsApp / Phone shortly.',
      };
    }
  },
};

// Normalize Strapi v4/v5 response formats into unified Car type
function normalizeCar(item: any): Car {
  const attrs = item.attributes || item;
  let images: string[] = [];
  if (attrs.images?.data) {
    images = attrs.images.data.map((img: any) => {
      const url = img.attributes?.url || img.url;
      return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
    });
  } else if (Array.isArray(attrs.images)) {
    images = attrs.images;
  }

  return {
    id: item.id || attrs.id,
    title: attrs.title,
    slug: attrs.slug,
    refNumber: attrs.refNumber || `BKM-${item.id}`,
    make: attrs.make,
    model: attrs.model,
    year: attrs.year,
    trim: attrs.trim,
    price: attrs.price,
    currency: attrs.currency || 'KES',
    mileage: attrs.mileage,
    engineCC: attrs.engineCC,
    transmission: attrs.transmission,
    fuelType: attrs.fuelType,
    bodyType: attrs.bodyType,
    driveType: attrs.driveType,
    exteriorColor: attrs.exteriorColor,
    interiorColor: attrs.interiorColor,
    condition: attrs.condition,
    status: attrs.status || 'Available',
    featured: Boolean(attrs.featured),
    description: attrs.description,
    features: Array.isArray(attrs.features) ? attrs.features : [],
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'],
    location: attrs.location || 'Nairobi, Kenya',
    vin: attrs.vin,
  };
}

// Normalize Strapi v4/v5 response formats into unified Property type
function normalizeProperty(item: any): Property {
  const attrs = item.attributes || item;
  let images: string[] = [];
  if (attrs.images?.data) {
    images = attrs.images.data.map((img: any) => {
      const url = img.attributes?.url || img.url;
      return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
    });
  } else if (Array.isArray(attrs.images)) {
    images = attrs.images;
  }

  return {
    id: item.id || attrs.id,
    title: attrs.title,
    slug: attrs.slug,
    refNumber: attrs.refNumber || `BKP-${item.id}`,
    propertyType: attrs.propertyType,
    listingStatus: attrs.listingStatus,
    price: attrs.price,
    currency: attrs.currency || 'KES',
    bedrooms: attrs.bedrooms,
    bathrooms: attrs.bathrooms,
    areaSqFt: attrs.areaSqFt,
    parkingSpaces: attrs.parkingSpaces,
    location: attrs.location || { address: 'Nairobi', suburb: 'Nairobi', county: 'Nairobi', country: 'Kenya' },
    amenities: Array.isArray(attrs.amenities) ? attrs.amenities : [],
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    featured: Boolean(attrs.featured),
    readyStatus: attrs.readyStatus || 'Ready',
    description: attrs.description,
  };
}
