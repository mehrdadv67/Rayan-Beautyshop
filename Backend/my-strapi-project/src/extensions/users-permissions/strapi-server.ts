import type { Core } from '@strapi/strapi';

export default (plugin: any): typeof plugin => {
  const userSchema = plugin.contentTypes?.user?.schema;
  if (userSchema) {
    userSchema.attributes = userSchema.attributes || {};
    if (!userSchema.attributes.orders) {
      userSchema.attributes.orders = {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::order.order',
        mappedBy: 'customer',
      };
    }
  }
  return plugin;
};
