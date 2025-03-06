import ParsablePayloadToken from "./ParsablePayloadToken.js";

export default class IdToken extends ParsablePayloadToken {
    constructor(jwt) {
        super(jwt);
        this.experationDate = this.payload.exp ? new Date(this.payload.exp * 1000) : "";
    }

    isValid() {
        if (!super.isValid()) {
            return false;
        }
        return this.experationDate.getTime() > new Date().getTime();
    }
}