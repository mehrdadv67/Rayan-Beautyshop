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
        cart: { type: 'json' },
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
        // Public role: read-only catalog access + anonymous auth flows.
        // Strapi 5 checks permissions (scopes) on users-permissions auth routes
        // too, so login/register/forgot-password must be granted explicitly.
        const publicActions = [
          "plugin::users-permissions.auth.connect",
          "plugin::users-permissions.auth.callback",
          "plugin::users-permissions.auth.register",
          "plugin::users-permissions.auth.forgotPassword",
          "plugin::users-permissions.auth.resetPassword",
          "plugin::users-permissions.auth.changePassword",
          "plugin::users-permissions.auth.sendEmailConfirmation",
          "plugin::users-permissions.auth.emailConfirmation",
          "plugin::users-permissions.auth.logout",
          "plugin::users-permissions.auth.refresh",
          "api::menu-item.menu-item.find",
          "api::category.category.find",
          "api::brand.brand.find",
          "api::attribute.attribute.find",
          "api::attribute-value.attribute-value.find",
          "api::product-variant.product-variant.find",
          "api::variant-option.variant-option.find",
          "api::product-tag.product-tag.find",
          "api::product-tag.product-tag.findOne",
          "api::product-collection.product-collection.find",
          "api::product-collection.product-collection.findOne",
          "api::product.product.find",
          "api::footer-menu.footer-menu.find",
        ];

        // Authenticated role: own profile + own orders + catalog reads.
        const authenticatedActions = [
          ...publicActions,
          "plugin::users-permissions.user.me",
          "plugin::users-permissions.user.update",
          "api::order.order.find",
          "api::order.order.findOne",
          "api::order-item.order-item.find",
          "api::order-item.order-item.findOne",
        ];

        const actions =
          roles.length === 2
            ? [
                ...publicActions.map((a) => ({ role: publicRole, action: a })),
                ...authenticatedActions.map((a) => ({ role: authenticatedRole, action: a })),
              ]
            : roles.flatMap((role) =>
                (role.type === 'public' ? publicActions : authenticatedActions).map(
                  (action) => ({ role, action })
                )
              );

        for (const { role, action } of actions) {
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

        // Remove over-broad permissions granted by earlier runs (e.g. public user.find / order.find).
        if (publicRole) {
          await strapi.query("plugin::users-permissions.permission").deleteMany({
            where: {
              role: publicRole.id,
              action: { $notIn: publicActions },
            },
          });
        }
        if (authenticatedRole) {
          await strapi.query("plugin::users-permissions.permission").deleteMany({
            where: {
              role: authenticatedRole.id,
              action: { $notIn: authenticatedActions },
            },
          });
        }
      } else {
        console.log("⚠️ No public or authenticated role found");
      }
     } catch (err) {
      console.error("Error setting permissions:", err);
    }

    try {
      const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });

      const advancedSettings = await pluginStore.get({ key: 'advanced' });
      if (advancedSettings && advancedSettings.email_confirmation) {
        // SMTP is not configured in this environment; keep confirmation off so
        // users can log in immediately after registering.
        await pluginStore.set({
          key: 'advanced',
          value: {
            ...advancedSettings,
            email_confirmation: false,
            email_reset_password:
              advancedSettings.email_reset_password ||
              process.env.EMAIL_RESET_PASSWORD_URL ||
              'http://localhost:3000/reset-password',
          },
        });
        console.log('✅ Email confirmation disabled (no SMTP configured)');
      }

      // Also un-confirm any stuck accounts that registered while confirmation was on.
      try {
        await strapi.db.query('plugin::users-permissions.user').updateMany({
          where: { confirmed: false, blocked: false },
          data: { confirmed: true },
        });
      } catch (err) {
        console.warn('⚠️ Could not un-confirm stuck users', err.message);
      }

      // Repair users that lost their role during schema migrations.
      try {
        const authRole = await strapi
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: 'authenticated' } });
        if (authRole) {
          await strapi.db.query('plugin::users-permissions.user').updateMany({
            where: { role: null },
            data: { role: authRole.id },
          });
        }
      } catch (err) {
        console.warn('⚠️ Could not repair missing user roles', err.message);
      }

      const emailTemplates = await pluginStore.get({ key: 'email' });
      if (emailTemplates) {
        const emailFrom = process.env.EMAIL_FROM || 'noreply@example.com';
        const emailFromName = process.env.EMAIL_FROM_NAME || 'Strapi';
        let updated = false;

        Object.keys(emailTemplates).forEach((key) => {
          const template = emailTemplates[key];
          if (template?.options?.from) {
            if (template.options.from.email === 'no-reply@strapi.io') {
              template.options.from.email = emailFrom;
              updated = true;
            }
            if (template.options.from.name === 'Administration Panel') {
              template.options.from.name = emailFromName;
              updated = true;
            }
          }
        });

        if (updated) {
          await pluginStore.set({ key: 'email', value: emailTemplates });
          console.log('✅ Email template sender updated');
        }
      }
    } catch (err) {
      console.error('Error configuring email settings:', err);
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

