export default class OIDCClient {
    #clientId;
    #returnUrl;
    #endPointUrl;

    constructor(clientId, returnUrl, endPointUrl) {
        this.#clientId = clientId;
        this.#returnUrl = returnUrl;
        this.#endPointUrl = endPointUrl;
    }

    async #tokenRequest(data) {
        let formBody = new URLSearchParams(data).toString();

        let response = await fetch(`${this.#endPointUrl}/oauth2/token`, {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
        return await response.json();
    }

    async getTokens(code, verificationCode) {
        const data = {
            grant_type: "authorization_code",
            client_id: this.#clientId,
            code_verifier: verificationCode,
            code: code,
            redirect_uri: this.#returnUrl
        }
        
        return await this.#tokenRequest(data);
    }

    async refreshTokens(refreshToken) {
        if (!refreshToken.isValid()) {
            return {};
        }

        const data = {
            grant_type: "refreshrefresh_token",
            client_id: this.#clientId,
            refresh_token: refreshToken
        }

        return await this.#tokenRequest(data);
    }
}