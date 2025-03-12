export default {
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_CLIENT_ID,
        identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
        loginWith: {
            oauth: {
                domain: import.meta.env.VITE_OAUTH_DOMAIN,
                scopes: import.meta.env.VITE_SCOPES.split(",").map((str) => str.trim()),
                redirectSignIn: import.meta.env.VITE_REDIRECT_SIGN_IN.split(",").map((str) => str.trim()),
                redirectSignOut: import.meta.env.VITE_REDIRECT_SIGN_OUT.split(",").map((str) => str.trim()),
                responseType: import.meta.env.VITE_RESPONSE_TYPE,
            }
        },
      },
    }
  }