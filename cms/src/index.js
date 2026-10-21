'use strict';

const bcrypt = require('bcryptjs');
const seedData = require('./seedData');

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    try {
      const superAdminRole = await strapi.admin.services.role.getSuperAdmin();

      // 1. Create Default Super Admin if no admin exists
      const adminCount = await strapi.query('admin::user').count();
      if (adminCount === 0) {
        await strapi.admin.services.user.create({
          email: 'admin@bkmotors.co.ke',
          firstname: 'BK',
          lastname: 'Admin',
          password: 'AdminPassword2026!',
          registrationToken: null,
          isActive: true,
          roles: [superAdminRole.id],
        });
        strapi.log.info('Default super admin created: admin@bkmotors.co.ke / AdminPassword2026!');
      }

      // 2. Create Seeded Sales Agents (Motors & Properties)
      const existingMotorsAgent = await strapi.query('admin::user').findOne({
        where: { email: 'motors.agent@bkmotors.co.ke' },
      });
      if (!existingMotorsAgent) {
        await strapi.admin.services.user.create({
          email: 'motors.agent@bkmotors.co.ke',
          firstname: 'James',
          lastname: 'Kamau (Motors Specialist)',
          password: 'AgentPassword2026!',
          registrationToken: null,
          isActive: true,
          roles: [superAdminRole.id],
        });
        strapi.log.info('Seeded Motors Agent: motors.agent@bkmotors.co.ke / AgentPassword2026!');
      }

      const existingPropertyAgent = await strapi.query('admin::user').findOne({
        where: { email: 'properties.agent@bkproperties.co.ke' },
      });
      if (!existingPropertyAgent) {
        await strapi.admin.services.user.create({
          email: 'properties.agent@bkproperties.co.ke',
          firstname: 'Sarah',
          lastname: 'Wanjiku (Senior Property Consultant)',
          password: 'AgentPassword2026!',
          registrationToken: null,
          isActive: true,
          roles: [superAdminRole.id],
        });
        strapi.log.info('Seeded Properties Agent: properties.agent@bkproperties.co.ke / AgentPassword2026!');
      }

      // 3. Configure Public & Authenticated Permissions for API endpoints
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        const permissionsToEnable = [
          { action: 'api::car.car.find' },
          { action: 'api::car.car.findOne' },
          { action: 'api::property.property.find' },
          { action: 'api::property.property.findOne' },
          { action: 'api::inquiry.inquiry.create' },
        ];

        for (const perm of permissionsToEnable) {
          const existing = await strapi.query('plugin::users-permissions.permission').findOne({
            where: {
              role: publicRole.id,
              action: perm.action,
            },
          });

          if (!existing) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: publicRole.id,
                action: perm.action,
              },
            });
          }
        }
        strapi.log.info('Public API permissions verified for cars, properties, and inquiries.');
      }

      const authRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });

      if (authRole) {
        const authPermissions = [
          { action: 'api::car.car.find' },
          { action: 'api::car.car.findOne' },
          { action: 'api::property.property.find' },
          { action: 'api::property.property.findOne' },
          { action: 'api::inquiry.inquiry.find' },
          { action: 'api::inquiry.inquiry.findOne' },
          { action: 'api::inquiry.inquiry.create' },
          { action: 'plugin::users-permissions.user.me' },
        ];

        for (const perm of authPermissions) {
          const existing = await strapi.query('plugin::users-permissions.permission').findOne({
            where: {
              role: authRole.id,
              action: perm.action,
            },
          });

          if (!existing) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: authRole.id,
                action: perm.action,
              },
            });
          }
        }
        strapi.log.info('Authenticated API permissions verified.');
      }

      // 4. Create Seeded Client Customer Account
      if (authRole) {
        const hashedPassword = await bcrypt.hash('ClientPassword2026!', 10);
        const existingClient = await strapi.query('plugin::users-permissions.user').findOne({
          where: { email: 'customer@bkmotors.co.ke' },
        });

        if (!existingClient) {
          await strapi.query('plugin::users-permissions.user').create({
            data: {
              username: 'davidmwangi',
              email: 'customer@bkmotors.co.ke',
              password: hashedPassword,
              provider: 'local',
              role: authRole.id,
              confirmed: true,
              blocked: false,
            },
          });
          strapi.log.info('Default client created: customer@bkmotors.co.ke / ClientPassword2026!');
        } else {
          await strapi.query('plugin::users-permissions.user').update({
            where: { id: existingClient.id },
            data: {
              password: hashedPassword,
              provider: 'local',
              confirmed: true,
              blocked: false,
            },
          });
        }
      }

      // 5. Seed Inquiries if none exist
      const inquiryCount = await strapi.entityService.count('api::inquiry.inquiry');
      if (inquiryCount === 0) {
        const seedInquiries = [
          {
            customerName: 'David Mwangi',
            email: 'customer@bkmotors.co.ke',
            phone: '+254 712 345 678',
            preferredContact: 'whatsapp',
            inquiryType: 'test_drive',
            itemId: '1',
            itemTitle: '2020 Toyota Land Cruiser Prado TX-L',
            message: 'Interested in weekend test drive along Ngong Road. Please confirm slot availability.',
            status: 'contacted',
          },
          {
            customerName: 'David Mwangi',
            email: 'customer@bkmotors.co.ke',
            phone: '+254 712 345 678',
            preferredContact: 'call',
            inquiryType: 'property_viewing',
            itemId: '1',
            itemTitle: '4-Bedroom Luxury Villa with Pool in Karen',
            message: 'Requesting private walkthrough this Saturday afternoon around 2 PM.',
            status: 'in_progress',
          },
          {
            customerName: 'David Mwangi',
            email: 'customer@bkmotors.co.ke',
            phone: '+254 712 345 678',
            preferredContact: 'whatsapp',
            inquiryType: 'sell_car',
            itemId: 'BKM-CONS-01',
            itemTitle: 'Consignment: 2019 Subaru Outback 2.5i Eyesight',
            message: 'Vehicle is ready for 150-point inspection and valuation at your hub.',
            status: 'new',
          },
        ];

        for (const inq of seedInquiries) {
          await strapi.entityService.create('api::inquiry.inquiry', {
            data: inq,
          });
        }
        strapi.log.info(`Seeded ${seedInquiries.length} inquiries.`);
      }

      // 4. Seed Cars if none exist
      const carCount = await strapi.entityService.count('api::car.car');
      if (carCount === 0) {
        for (const car of seedData.cars) {
          await strapi.entityService.create('api::car.car', {
            data: {
              ...car,
              publishedAt: new Date(),
            },
          });
        }
        strapi.log.info(`Seeded ${seedData.cars.length} cars into Strapi database.`);
      }

      // 5. Seed Properties if none exist
      const propCount = await strapi.entityService.count('api::property.property');
      if (propCount === 0) {
        for (const prop of seedData.properties) {
          await strapi.entityService.create('api::property.property', {
            data: {
              ...prop,
              publishedAt: new Date(),
            },
          });
        }
        strapi.log.info(`Seeded ${seedData.properties.length} properties into Strapi database.`);
      }
    } catch (err) {
      strapi.log.error('Bootstrap error occurred:', err);
    }
  },
};
