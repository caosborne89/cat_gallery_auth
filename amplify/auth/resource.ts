import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      callbackUrls: ['http://localhost:8080', 'https://main.d2g0u56zulkf0z.amplifyapp.com'],
      logoutUrls: ['http://localhost:8080', 'https://main.d2g0u56zulkf0z.amplifyapp.com'],
    },
  },
});
