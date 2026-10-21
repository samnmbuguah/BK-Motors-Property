import { AuthResponse, User, InquiryItem, InquiryFormData } from '../types';

const STRAPI_BASE_URL =
  import.meta.env.VITE_STRAPI_URL || 'https://bkapi.169-58-102-217.sslip.io';

// Mock storage key for offline/fallback inquiries
const LOCAL_INQUIRIES_KEY = 'bk_local_inquiries';

export const authService = {
  /**
   * Log in with Strapi local auth (email or username)
   */
  async login(identifier: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${STRAPI_BASE_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message =
          errorData?.error?.message || 'Invalid email or password. Please verify your credentials.';
        throw new Error(message);
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (err: any) {
      // If server error or offline demo credentials
      if (
        (identifier === 'customer@bkmotors.co.ke' || identifier === 'davidmwangi') &&
        password === 'ClientPassword2026!'
      ) {
        return {
          jwt: 'mock-jwt-token-david-mwangi',
          user: {
            id: 2,
            username: 'davidmwangi',
            email: 'customer@bkmotors.co.ke',
            confirmed: true,
            createdAt: new Date().toISOString(),
          },
        };
      }
      throw err;
    }
  },

  /**
   * Register a new client account
   */
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${STRAPI_BASE_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message =
          errorData?.error?.message ||
          'Registration failed. Email or username might already be in use.';
        throw new Error(message);
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  /**
   * Fetch current authenticated user's profile
   */
  async getProfile(jwt: string): Promise<User | null> {
    try {
      const response = await fetch(`${STRAPI_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },

  /**
   * Fetch inquiries for the authenticated user
   */
  async getUserInquiries(jwt: string, email: string): Promise<InquiryItem[]> {
    try {
      const url = `${STRAPI_BASE_URL}/api/inquiries?filters[email][$eq]=${encodeURIComponent(
        email
      )}&sort=createdAt:desc`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.data && Array.isArray(json.data)) {
          const fetched: InquiryItem[] = json.data.map((item: any) => ({
            id: item.id,
            customerName: item.attributes.customerName,
            phone: item.attributes.phone,
            email: item.attributes.email,
            message: item.attributes.message,
            preferredContact: item.attributes.preferredContact,
            inquiryType: item.attributes.inquiryType,
            itemId: item.attributes.itemId,
            itemTitle: item.attributes.itemTitle,
            status: item.attributes.status || 'new',
            createdAt: item.attributes.createdAt,
            updatedAt: item.attributes.updatedAt,
          }));

          // Merge any locally cached inquiries submitted while offline
          const localStored = localStorage.getItem(LOCAL_INQUIRIES_KEY);
          if (localStored) {
            try {
              const localItems: InquiryItem[] = JSON.parse(localStored);
              const userLocal = localItems.filter((i) => i.email === email);
              return [...userLocal, ...fetched];
            } catch {
              // ignore json parse error
            }
          }

          return fetched;
        }
      }
    } catch (e) {
      console.warn('Could not fetch inquiries from Strapi, falling back to local storage', e);
    }

    // Fallback if offline or server returned error
    const localStored = localStorage.getItem(LOCAL_INQUIRIES_KEY);
    if (localStored) {
      try {
        const items: InquiryItem[] = JSON.parse(localStored);
        return items.filter((i) => i.email === email);
      } catch {
        return [];
      }
    }

    // Default seeded sample inquiries for demo client
    if (email === 'customer@bkmotors.co.ke') {
      return [
        {
          id: 1,
          customerName: 'David Mwangi',
          email: 'customer@bkmotors.co.ke',
          phone: '+254 712 345 678',
          preferredContact: 'whatsapp',
          inquiryType: 'test_drive',
          itemId: '1',
          itemTitle: '2020 Toyota Land Cruiser Prado TX-L',
          message: 'Interested in weekend test drive along Ngong Road. Please confirm slot availability.',
          status: 'contacted',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 2,
          customerName: 'David Mwangi',
          email: 'customer@bkmotors.co.ke',
          phone: '+254 712 345 678',
          preferredContact: 'call',
          inquiryType: 'property_viewing',
          itemId: '1',
          itemTitle: '4-Bedroom Luxury Villa with Pool in Karen',
          message: 'Requesting private walkthrough this Saturday afternoon around 2 PM.',
          status: 'in_progress',
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        },
        {
          id: 3,
          customerName: 'David Mwangi',
          email: 'customer@bkmotors.co.ke',
          phone: '+254 712 345 678',
          preferredContact: 'whatsapp',
          inquiryType: 'sell_car',
          itemId: 'BKM-CONS-01',
          itemTitle: 'Consignment: 2019 Subaru Outback 2.5i Eyesight',
          message: 'Vehicle is ready for 150-point inspection and valuation at your hub.',
          status: 'new',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    }

    return [];
  },

  /**
   * Save a newly submitted inquiry (either via Strapi or locally)
   */
  async recordInquiry(data: InquiryFormData, jwt?: string | null): Promise<InquiryItem> {
    const newItem: InquiryItem = {
      id: Date.now(),
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      message: data.message,
      preferredContact: data.preferredContact,
      inquiryType: data.inquiryType,
      itemId: data.itemId?.toString(),
      itemTitle: data.itemTitle,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // Store in local storage for instant feedback
    try {
      const stored = localStorage.getItem(LOCAL_INQUIRIES_KEY);
      const list: InquiryItem[] = stored ? JSON.parse(stored) : [];
      list.unshift(newItem);
      localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(list.slice(0, 50)));
    } catch {
      // ignore
    }

    // Also attempt Strapi submission
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
      }

      await fetch(`${STRAPI_BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data }),
      });
    } catch (e) {
      console.warn('Strapi inquiry background sync failed:', e);
    }

    return newItem;
  },
};
