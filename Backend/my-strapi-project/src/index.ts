export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: any }) {
    try {
      const publicRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "public" } });

      if (publicRole) {
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
          "api::product.product.find",
          "api::product.product.create",
          "api::product.product.update",
        ];

        for (const action of actions) {
          const existing = await strapi
            .query("plugin::users-permissions.permission")
            .findOne({
              where: {
                role: publicRole.id,
                action,
              },
            });

          if (!existing) {
            await strapi.query("plugin::users-permissions.permission").create({
              data: {
                action,
                role: publicRole.id,
              },
            });
            console.log(`✅ Public role granted access to ${action}`);
          } else {
            console.log(`ℹ️ ${action} permission already exists`);
          }
        }
      } else {
        console.log("⚠️ Public role not found");
      }
    } catch (err) {
      console.error("Error setting menu permissions:", err);
    }
  },
};
