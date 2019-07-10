import { applyDecimalExponent, toDataView } from "../utils";
export const WeightMeasurementCallback = (data) => {
    const view = toDataView(data);
    const flags = view.getUint8(0);
    let index = 1;
    let measurement = {};
    const isImperial = !!(flags & 0x1);
    const weightExp = isImperial ? -2 : -3;
    const weightMult = isImperial ? 1 : 5;
    const units = isImperial ? { weight: "lb", height: "inch" } : { weight: "kg", height: "m" };
    const weight = applyDecimalExponent(view.getUint16(index, true), weightExp, weightMult);
    index += 2;
    measurement = Object.assign({}, measurement, { units, weight });
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
    const userIdPresent = flags & 0x4;
    if (userIdPresent) {
        const userId = view.getUint8(index);
        index += 1;
        measurement = Object.assign({}, measurement, { userId });
    }
    const bmiAndHeightPresent = flags & 0x8;
    if (bmiAndHeightPresent) {
        const bmi = applyDecimalExponent(view.getUint16(index, true), -1);
        index += 2;
        const height = applyDecimalExponent(view.getUint16(index, true), isImperial ? -1 : -3);
        index += 2;
        measurement = Object.assign({}, measurement, { bmi, height });
    }
    return measurement;
};
//# sourceMappingURL=weight-measurement.js.map