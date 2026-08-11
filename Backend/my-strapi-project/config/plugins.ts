import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  email: {
    config: {
      provider: env('EMAIL_PROVIDER', 'sendmail'),
      providerOptions:
        env('EMAIL_PROVIDER', 'sendmail') === 'nodemailer'
          ? {
              host: env('SMTP_HOST'),
              port: env.int('SMTP_PORT', 587),
              secure: env.bool('SMTP_SECURE', false),
              auth: {
                user: env('SMTP_USERNAME'),
                pass: env('SMTP_PASSWORD'),
              },
            }
          : {},
      settings: {
        defaultFrom: env('EMAIL_FROM', 'noreply@example.com'),
        defaultReplyTo: env('EMAIL_REPLY_TO', env('EMAIL_FROM', 'noreply@example.com')),
      },
    },
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
      jwt: {
        expiresIn: env('JWT_EXPIRES_IN', '30d'),
      },
      jwtManagement: 'legacy-support',
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
      ratelimit: {
        enabled: true,
        interval: env.int('AUTH_RATE_LIMIT_INTERVAL', 60000),
        max: env.int('AUTH_RATE_LIMIT_MAX', 10),
      },
    },
  },
});

export default config;
