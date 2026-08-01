import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      provider: 'google',
    },
    register: {
      allowedFields: [
        'username',
        'email',
        'password',
        'firstName',
        'lastName',
        'phoneNumber',
        'address',
        'city',
        'zipCode',
        'gender',
      ],
    },
  },
});

export default config;
