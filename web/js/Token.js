export default class Token {
    constructor(jwt) {
        this.jwt = jwt;
        this.payload = jwt ? this.#parseJwtPayload(jwt) : null;
    }

    #parseJwtPayload(jwt) {
        const parts = jwt.split('.');
        const payload = parts[1];
        const decodedPayload = JSON.parse(atob(payload));
        return decodedPayload;
    }

    isValid() {
        return !(this.jwt == null || this.jwt == "undefined");
    }
}