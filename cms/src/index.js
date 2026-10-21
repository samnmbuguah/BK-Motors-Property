'use strict';

const seedData = require('./seedData');

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    try {
      // 1. Create Default Super Admin if no admin exists
      const adminCount = await strapi.admin.services.user.count();
      if (adminCount === 0) {
        const superAdminRole = await strapi.admin.services.role.getSuperAdmin();
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

      // 2. Configure Public Permissions for API endpoints
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

      // 3. Seed Cars if none exist
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

      // 4. Seed Properties if none exist
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
