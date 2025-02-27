import Token from "./Token.js";

export default class ParsablePayloadToken extends Token {
    constructor(jwt) {
        super(jwt);
        this.payload = jwt ? this.#parseJwtPayload(jwt) : null;
    }

    #parseJwtPayload(jwt) {
        const parts = jwt.split('.');
        const payload = parts[1];
        const decodedPayload = JSON.parse(atob(payload));
        return decodedPayload;
    }
}