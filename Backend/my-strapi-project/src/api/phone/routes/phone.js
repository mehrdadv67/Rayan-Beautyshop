export default {
  routes: [
    {
      method: 'GET',
      path: '/phones',
      handler: 'phone.find',
      config: {
        policies: ['plugin::users-permissions.auth'],
      },
    },
    {
      method: 'GET',
      path: '/phones/:id',
      handler: 'phone.findOne',
      config: {
        policies: ['plugin::users-permissions.auth'],
      },
    },
    {
      method: 'POST',
      path: '/phones',
      handler: 'phone.create',
      config: {
        policies: ['plugin::users-permissions.auth'],
      },
    },
    {
      method: 'PUT',
      path: '/phones/:id',
      handler: 'phone.update',
      config: {
        policies: ['plugin::users-permissions.auth'],
      },
    },
    {
      method: 'DELETE',
      path: '/phones/:id',
      handler: 'phone.delete',
      config: {
        policies: ['plugin::users-permissions.auth'],
      },
    },
  ],
};