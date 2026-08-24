import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::discount-subscription.discount-subscription', ({ strapi }) => ({
  async create(ctx) {
    const { body = {} } = ctx.request;

    if (!body.data || typeof body.data !== 'object') {
      return ctx.badRequest('Missing "data" payload in the request body');
    }

    const sanitizedInputData = (await this.sanitizeInput(body.data as Record<string, any>, ctx)) as Record<string, any>;

    if (!sanitizedInputData.date) {
      sanitizedInputData.date = new Date().toISOString();
    }

    const entity = await strapi.service('api::discount-subscription.discount-subscription').create({
      data: sanitizedInputData,
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    ctx.status = 201;
    return this.transformResponse(sanitizedEntity);
  },
}));
