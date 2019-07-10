import { getFloat32, toDataView } from "../utils";
export const TemperatureMeasurementCallback = (data) => {
    const view = toDataView(data);
    const flags = view.getUint8(0);
    let index = 1;
    let measurement = {};
    const unit = (flags & 0x1) ? "F" : "C";
    const temperature = getFloat32(view, index);
    measurement = Object.assign({}, measurement, { unit, temperature });
    index += 4;
    const timestampPresent = flags & 0x2;
    if (timestampPresent) {
        const year = view.getUint16(index, true);
        index += 2;
        // Months start at 0 in JS
        const month = view.getUint8(index) - 1;
        index += 1;
        const day = view.getUint8(index);
        index += 1;
        const hours = view.getUint8(index);
        index += 1;
        const minutes = view.getUint8(index);
        index += 1;
        const seconds = view.getUint8(index);
        index += 1;
        const timestamp = new Date(year, month, day, hours, minutes, seconds);
        measurement = Object.assign({}, measurement, { timestamp });
    }
    const temperatureTypePresent = flags & 0x4;
    if (temperatureTypePresent) {
        const temperatureType = view.getUint8(index);
        measurement = Object.assign({}, measurement, { temperatureType });
    }
    return measurement;
};
//# sourceMappingURL=temperature-measurement.js.map