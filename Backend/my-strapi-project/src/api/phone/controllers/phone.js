'use strict';

module.exports = {
  async find(ctx) {
    const { user } = ctx.state;

    if (!user) {
      return ctx.unauthorized('Unauthorized');
    }

    const phones = await strapi.db.query('api::phone.phone').findMany({
      where: { user: user.id },
      populate: ['user'],
    });

    return phones;
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    if (!user) {
      return ctx.unauthorized('Unauthorized');
    }

    const phone = await strapi.db.query('api::phone.phone').findOne({
      where: { id, user: user.id },
      populate: ['user'],
    });

    if (!phone) {
      return ctx.notFound('Phone not found');
    }

    return phone;
  },

  async create(ctx) {
    const { user } = ctx.state;

    if (!user) {
      return ctx.unauthorized('Unauthorized');
    }

    const { number, isPrimary } = ctx.request.body;

    if (isPrimary) {
      await strapi.db.query('api::phone.phone').updateMany({
        where: { user: user.id },
        data: { isPrimary: false },
      });
    }

    const phone = await strapi.db.query('api::phone.phone').create({
      data: {
        number,
        isPrimary: isPrimary || false,
        user: user.id,
      },
    });

    return phone;
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    if (!user) {
      return ctx.unauthorized('Unauthorized');
    }

    const phone = await strapi.db.query('api::phone.phone').findOne({
      where: { id, user: user.id },
    });

    if (!phone) {
      return ctx.notFound('Phone not found');
    }

    const { number, isPrimary } = ctx.request.body;

    if (isPrimary) {
      await strapi.db.query('api::phone.phone').updateMany({
        where: { user: user.id },
        data: { isPrimary: false },
      });
    }

    const updated = await strapi.db.query('api::phone.phone').update({
      where: { id },
      data: {
        number,
        isPrimary: isPrimary ?? phone.isPrimary,
      },
    });

    return updated;
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    if (!user) {
      return ctx.unauthorized('Unauthorized');
    }

    const phone = await strapi.db.query('api::phone.phone').findOne({
      where: { id, user: user.id },
    });

    if (!phone) {
      return ctx.notFound('Phone not found');
    }

    await strapi.db.query('api::phone.phone').delete({
      where: { id },
    });

    return { deleted: true };
  },
};