/**
 * banner controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::banner.banner', ({ strapi }) => {
  return {
    async findPublic(ctx) {
      const query = ctx.query || {};
      const filters = (query as any).filters || {};
      const result = await strapi.entityService.findMany(
        'api::banner.banner',
        {
          ...(query as any),
          filters: {
            ...filters,
            isActive: true,
          },
        }
      );
      return result;
    },
  };
});
