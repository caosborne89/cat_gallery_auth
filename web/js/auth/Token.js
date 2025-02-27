export default class Token {
    constructor(jwt) {
        this.jwt = jwt;
    }

    isValid() {
        return !(this.jwt == null || this.jwt == "undefined");
    }
}