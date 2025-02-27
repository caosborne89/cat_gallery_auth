import OIDCClient from "./OIDCClient";

export default class OAuthClient {
    #idToken;
    #accessToken;
    #refreshToken;
    #oidcClient;

    static ID_TOKEN_KEY = "id_token";
    static ACCESS_TOKEN_KEY = "access_token";
    static REFRESH_TOKEN_KEY = "access_token";

    constructor(clientID, redirectUrl, endPointUrl) {
        this.#setTokens();
        this.#oidcClient = new OIDCClient(clientID, redirectUrl, endPointUrl);
    }

    async #authenticated() {
        if (this.#idToken.isValid()) {
            return true;
        }

        if (!this.#refreshToken.isValid()) {
            return false;
        }

        const response = await this.#oidcClient.refreshTokens();

        if (response.error == "invalid_grant" || !response.access_token || !response.id_token) {
            return false;
        }

        localStorage.setItem(this.ID_TOKEN_KEY, response.id_token);
        localStorage.setItem(this.ACCESS_TOKEN_KEY, response.access_token);

        return true;
    }

    async authenticate() {
        if (await this.#authenticated()) {
            return true;
        }

        let token = this.#getAuthCode();

        if (!token) {
            return false;
        }

        const verificationCode = getCookie("catGallaryCognitoCodeChallenge");

        const response = this.#oidcClient.getTokens();

        if (response.error || !response.access_token || !response.id_token || !response.refresh_token) {
            return false;
        }

        localStorage.setItem(this.ID_TOKEN_KEY, response.id_token);
        localStorage.setItem(this.ACCESS_TOKEN_KEY, response.access_token);
        localStorage.setItem(this.ACCESS_TOKEN_KEY, response.refresh_token);
    }

    #getCookie(name) {
        const cookieString = document.cookie;
        const cookies = cookieString.split(';');
      
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
          }
        }
        return null;
    }

    async createCodeChallenge() {
        const codeVerifier = generateCodeVerifier();
        const hashedCodeVerifier = await sha256(codeVerifier);
        const now = new Date();
        now.setDate(now.getDate() + (5 * 1000));
        const expirationDate = now.toUTCString();
        document.cookie = `catGallaryCognitoCodeChallenge=${codeVerifier}; expires=${expirationDate}; path=/`;
        return hashedCodeVerifier;
    }

    #getAuthCode() {
        const params = new URLSearchParams(document.location.search);
        return params.get("code");
    }

    #setTokens() {
        this.#idToken = new IdToken(localStorage.getItem(this.ID_TOKEN_KEY));
        this.#accessToken = new Token(localStorage.getItem(this.ACCESS_TOKEN_KEY));
        this.#refreshToken = new Token(localStorage.getItem(this.REFRESH_TOKEN_KEY));
    }
}