export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: any }) {
    try {
      const publicRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "public" } });

      if (publicRole) {
        const existing = await strapi
          .query("plugin::users-permissions.permission")
          .findOne({
            where: {
              role: publicRole.id,
              action: "api::menu-item.menu-item.find",
            },
          });

        if (!existing) {
          await strapi.query("plugin::users-permissions.permission").create({
            data: {
              action: "api::menu-item.menu-item.find",
              role: publicRole.id,
            },
          });
          console.log("✅ Public role granted access to menu-items.find");
        } else {
          console.log("ℹ️ menu-items.find permission already exists");
        }
      } else {
        console.log("⚠️ Public role not found");
      }
    } catch (err) {
      console.error("Error setting menu permissions:", err);
    }
  },
};
