import OIDCClient from "./OIDCClient.js";
import IdToken from "./IdToken.js";
import Token from "./Token.js";

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
        if (this.#idToken && this.#idToken.isValid()) {
            return true;
        }

        if (!this.#refreshToken || !this.#refreshToken.isValid()) {
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

        const code = this.#getAuthCode();

        if (!code) {
            return false;
        }

        const verificationCode = this.#getCookie("catGallaryCognitoCodeChallenge");
        const response = this.#oidcClient.getTokens(code,verificationCode);

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
    
    static async #sha256(codeVerifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const base64Url = btoa(String.fromCharCode(...hashArray))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        return base64Url;
    }

    static #generateCodeVerifier() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let codeVerifier = '';
        for (let i = 0; i < 128; i++) {
            codeVerifier += characters.charAt(crypto.getRandomValues(new Uint32Array(1))[0] % characters.length);
        }
    
        return codeVerifier;
    }

    static async createCodeChallenge() {
        const codeVerifier = this.#generateCodeVerifier();
        const hashedCodeVerifier = await this.#sha256(codeVerifier);
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
        const idTokenJwt = localStorage.getItem(this.ID_TOKEN_KEY);
        const accessTokenJwt = localStorage.getItem(this.ACCESS_TOKEN_KEY);
        const refreshTokenJwt = localStorage.getItem(this.REFRESH_TOKEN_KEY);

        this.#idToken = idTokenJwt ? new IdToken(idTokenJwt) : null;
        this.#accessToken = accessTokenJwt ? new IdToken(accessTokenJwt) : null;
        this.#refreshToken = refreshTokenJwt ? new IdToken(refreshTokenJwt) : null;
    }
}