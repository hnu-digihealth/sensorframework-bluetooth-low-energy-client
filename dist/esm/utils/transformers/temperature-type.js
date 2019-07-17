import { toDataView } from "../utils";
export const TemperatureTypeCallback = (data) => {
    const view = toDataView(data);
    const type = view.getUint8(0);
    return type;
};
//# sourceMappingURL=temperature-type.js.map