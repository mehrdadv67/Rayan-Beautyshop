import { factories } from '@strapi/strapi';
import strapiUtils from '@strapi/utils';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Unauthorized');
    }

    await this.validateQuery(ctx);
    const { body = {} } = ctx.request;

    if (!body.data || typeof body.data !== 'object') {
      throw new strapiUtils.errors.ValidationError('Missing "data" payload in the request body');
    }

    const sanitizedInputData = (await this.sanitizeInput(body.data as Record<string, any>, ctx)) as Record<string, any>;

    sanitizedInputData.customer = { connect: [user.id] };

    const entity = await strapi.service('api::order.order').create({
      data: sanitizedInputData,
    });

    const { products } = sanitizedInputData;
    if (products && Array.isArray(products) && products.length > 0) {
      for (const product of products) {
        await strapi.entityService.create('api::order-item.order-item', {
          data: {
            quantity: product.quantity || 1,
            price_snapshot: product.price || 0,
            order: entity.id,
            order_item: product.id || null,
          },
        });
      }
    }

    const populated = await strapi.entityService.findOne('api::order.order', entity.id, {
      populate: ['customer', 'order_items', 'order_items.order_item'],
    });

    const sanitizedEntity = await this.sanitizeOutput(populated, ctx);
    ctx.status = 201;
    return this.transformResponse(sanitizedEntity);
  },

  async find(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Unauthorized');
    }

    await this.validateQuery(ctx);
    const sanitizedQuery = (await this.sanitizeQuery(ctx)) as Record<string, any>;

    sanitizedQuery.filters = sanitizedQuery.filters || {};
    sanitizedQuery.filters.customer = sanitizedQuery.filters.customer || {};
    sanitizedQuery.filters.customer.id = { $eq: user.id };

    const { results, pagination } = await strapi.service('api::order.order').find(sanitizedQuery);
    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(sanitizedResults, {
      pagination,
    });
  },

  async findOne(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Unauthorized');
    }

    await this.validateQuery(ctx);
    const sanitizedQuery = await this.sanitizeQuery(ctx);

    const entity = await strapi.service('api::order.order').findOne(ctx.params.id, sanitizedQuery);

    if (!entity || String((entity as any).customer?.id) !== String(user.id)) {
      return ctx.notFound('Order not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },
}));
