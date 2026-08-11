import { factories } from '@strapi/strapi';
import strapiUtils from '@strapi/utils';

export default factories.createCoreController('api::order-item.order-item', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Unauthorized');
    }

    await this.validateQuery(ctx);
    const sanitizedQuery = (await this.sanitizeQuery(ctx)) as Record<string, any>;

    sanitizedQuery.filters = sanitizedQuery.filters || {};
    sanitizedQuery.filters.order = sanitizedQuery.filters.order || {};
    sanitizedQuery.filters.order.customer = sanitizedQuery.filters.order.customer || {};
    sanitizedQuery.filters.order.customer.id = { $eq: user.id };

    const { results, pagination } = await strapi.service('api::order-item.order-item').find(sanitizedQuery);
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
    const sanitizedQuery = (await this.sanitizeQuery(ctx)) as Record<string, any>;

    const entity = await strapi.service('api::order-item.order-item').findOne(ctx.params.id, sanitizedQuery);

    if (!entity) {
      return ctx.notFound('Order item not found');
    }

    const order = await strapi.entityService.findOne('api::order.order', (entity as any).order?.id, {
      populate: ['customer'],
    });

    if (!order || String((order as any).customer?.id) !== String(user.id)) {
      return ctx.notFound('Order item not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },

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

    const orderId = sanitizedInputData.order?.id || sanitizedInputData.order;
    if (!orderId) {
      return ctx.badRequest('Order is required');
    }

    const order = await strapi.entityService.findOne('api::order.order', orderId, {
      populate: ['customer'],
    });

    if (!order || String((order as any).customer?.id) !== String(user.id)) {
      return ctx.forbidden('You do not have permission to add items to this order');
    }

    const entity = await strapi.service('api::order-item.order-item').create({
      data: sanitizedInputData,
    });

    const populated = await strapi.entityService.findOne('api::order-item.order-item', entity.id, {
      populate: ['order', 'order_item'],
    });

    const sanitizedEntity = await this.sanitizeOutput(populated, ctx);
    ctx.status = 201;
    return this.transformResponse(sanitizedEntity);
  },

  async update(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Unauthorized');
    }

    await this.validateQuery(ctx);
    const { id } = ctx.params;
    const { body = {} } = ctx.request;

    if (!body.data || typeof body.data !== 'object') {
      throw new strapiUtils.errors.ValidationError('Missing "data" payload in the request body');
    }

    const existing = await strapi.service('api::order-item.order-item').findOne(id);
    if (!existing) {
      return ctx.notFound('Order item not found');
    }

    const order = await strapi.entityService.findOne('api::order.order', (existing as any).order?.id, {
      populate: ['customer'],
    });

    if (!order || String((order as any).customer?.id) !== String(user.id)) {
      return ctx.forbidden('You do not have permission to update this order item');
    }

    const sanitizedInputData = (await this.sanitizeInput(body.data as Record<string, any>, ctx)) as Record<string, any>;

    const entity = await strapi.service('api::order-item.order-item').update(id, {
      data: sanitizedInputData,
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },

  async delete(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Unauthorized');
    }

    const { id } = ctx.params;

    const existing = await strapi.service('api::order-item.order-item').findOne(id);
    if (!existing) {
      return ctx.notFound('Order item not found');
    }

    const order = await strapi.entityService.findOne('api::order.order', (existing as any).order?.id, {
      populate: ['customer'],
    });

    if (!order || String((order as any).customer?.id) !== String(user.id)) {
      return ctx.forbidden('You do not have permission to delete this order item');
    }

    await strapi.service('api::order-item.order-item').delete(id);

    return this.transformResponse({ deleted: true });
  },
}));
