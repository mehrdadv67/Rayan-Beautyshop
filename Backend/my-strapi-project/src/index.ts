export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: any }) {
    try {
      const userModelUID = 'plugin::users-permissions.user';
      const model = strapi.getModel(userModelUID);
      const customAttributes = {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        phoneNumber: { type: 'string' },
        address: { type: 'text' },
        city: { type: 'string' },
        zipCode: { type: 'string' },
        gender: { type: 'enumeration', enum: ['male', 'female'] },
      };

      Object.entries(customAttributes).forEach(([key, attr]) => {
        if (!model.attributes[key]) {
          model.attributes[key] = attr as any;
          console.log(`✅ Added ${key} to user schema`);
        }
      });
    } catch (err) {
      console.error('Error extending user schema:', err);
    }

    try {
      const publicRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "public" } });

      const authenticatedRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "authenticated" } });

      const roles = [];
      if (publicRole) roles.push(publicRole);
      if (authenticatedRole) roles.push(authenticatedRole);

      if (roles.length > 0) {
        const actions = [
          "api::menu-item.menu-item.find",
          "api::attribute.attribute.find",
          "api::attribute-value.attribute-value.find",
          "api::attribute-value.attribute-value.create",
          "api::attribute-value.attribute-value.update",
          "api::attribute-value.attribute-value.delete",
          "api::product-variant.product-variant.find",
          "api::product-variant.product-variant.create",
          "api::product-variant.product-variant.update",
          "api::product-variant.product-variant.delete",
          "api::variant-option.variant-option.find",
          "api::variant-option.variant-option.update",
          "api::variant-option.variant-option.delete",
          "api::product-tag.product-tag.find",
          "api::product-tag.product-tag.findOne",
          "api::product-collection.product-collection.find",
          "api::product-collection.product-collection.findOne",
          "api::product.product.find",
          "api::product.product.create",
          "api::product.product.update",
          "plugin::users-permissions.user.find",
          "plugin::users-permissions.user.findOne",
          "plugin::users-permissions.user.me",
          "plugin::users-permissions.user.update",
          "plugin::users-permissions.auth.find",
          "plugin::users-permissions.auth.connect",
          "plugin::users-permissions.auth.callback",
          "api::order.order.find",
          "api::order.order.findOne",
          "api::order-item.order-item.find",
          "api::order-item.order-item.findOne",
        ];

        for (const action of actions) {
          for (const role of roles) {
            const existing = await strapi
              .query("plugin::users-permissions.permission")
              .findOne({
                where: {
                  role: role.id,
                  action,
                },
              });

            if (!existing) {
              await strapi.query("plugin::users-permissions.permission").create({
                data: {
                  action,
                  role: role.id,
                },
              });
              console.log(`✅ ${role.type} role granted access to ${action}`);
            } else {
              console.log(`ℹ️ ${action} permission already exists for ${role.type}`);
            }
          }
        }
      } else {
        console.log("⚠️ No public or authenticated role found");
      }
    } catch (err) {
      console.error("Error setting permissions:", err);
    }

    try {
      await strapi.db.query("api::product.product").createMany({
        data: [],
      });
    } catch (e) {
      console.warn("⚠️ Failed to warm product table", e.message);
    }
  },
};

