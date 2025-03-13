import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'amplifyTeamDrive',
  // access: (allow) => ({
  //   "picture-submission/*": [
  //     allow.guest.to(["get"]), // Allow guest users to read files in the 'public/*' path
  //     // Optionally, allow authenticated users to have more permissions
  //     allow.authenticated.to(["get", "write", "delete"])
  //   ],
  // }),
  access: (allow) => ({
    'picture-submissions/*': [
      allow.authenticated.to(['read','write', 'delete']),
      allow.guest.to(['read'])
    ],
  })
});