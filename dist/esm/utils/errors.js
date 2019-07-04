export class OptionsRequiredError extends Error {
    constructor() {
        super("This method requires an options argument");
    }
}
export class NotConnectedError extends Error {
    constructor() {
        super("Not connected to requested peripheral");
    }
}
//# sourceMappingURL=errors.js.map