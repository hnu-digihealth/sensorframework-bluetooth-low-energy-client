import { applyDecimalExponent, toDataView } from "../utils";
export const BodyCompositionMeasurementCallback = (data) => {
    const view = toDataView(data);
    const flags = view.getUint16(0, true);
    let index = 2;
    let measurement = {};
    const isImperial = !!(flags & 0x1);
    const units = isImperial ? { weight: "lb", height: "inch" } : { weight: "kg", height: "m" };
    measurement = Object.assign({}, measurement, { units });
    const weightExp = isImperial ? -2 : -3;
    const weightMult = isImperial ? 1 : 5;
    const bodyFatPercentage = applyDecimalExponent(view.getUint16(index, true), -1);
    measurement = Object.assign({}, measurement, { bodyFatPercentage });
    index += 2;
    const timeStampPresent = flags & 0x2;
    if (timeStampPresent) {
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
        measurement = Object.assign({}, measurement, { userId });
        index += 1;
    }
    const basalMetabolismPresent = flags & 0x8;
    if (basalMetabolismPresent) {
        //unit kilo Joules
        const basalMetabolism = view.getUint16(index, true);
        measurement = Object.assign({}, measurement, { basalMetabolism });
        index += 2;
    }
    const musclePercentagePresent = flags & 0x10;
    if (musclePercentagePresent) {
        const musclePercentage = applyDecimalExponent(view.getUint16(index, true), -1);
        measurement = Object.assign({}, measurement, { musclePercentage });
        index += 2;
    }
    const muscleMassPresent = flags & 0x20;
    if (muscleMassPresent) {
        const muscleMass = applyDecimalExponent(view.getUint16(index, true), weightExp, weightMult);
        measurement = Object.assign({}, measurement, { muscleMass });
        index += 2;
    }
    const fatFreeMassPresent = flags & 0x40;
    if (fatFreeMassPresent) {
        const fatFreeMass = applyDecimalExponent(view.getUint16(index, true), weightExp, weightMult);
        measurement = Object.assign({}, measurement, { fatFreeMass });
        index += 2;
    }
    const softLeanMassPresent = flags & 0x80;
    if (softLeanMassPresent) {
        const softLeanMass = applyDecimalExponent(view.getUint16(index, true), weightExp, weightMult);
        measurement = Object.assign({}, measurement, { softLeanMass });
        index += 2;
    }
    const bodyWaterMassPresent = flags & 0x100;
    if (bodyWaterMassPresent) {
        const bodyWaterMass = applyDecimalExponent(view.getUint16(index, true), weightExp, weightMult);
        measurement = Object.assign({}, measurement, { bodyWaterMass });
        index += 2;
    }
    const impedancePresent = flags & 0x200;
    if (impedancePresent) {
        //unit is OHM
        const impedance = applyDecimalExponent(view.getUint16(index, true), -1);
        measurement = Object.assign({}, measurement, { impedance });
        index += 2;
    }
    const weightPresent = flags & 0x400;
    if (weightPresent) {
        const weight = applyDecimalExponent(view.getUint16(index, true), weightExp, weightMult);
        measurement = Object.assign({}, measurement, { weight });
        index += 2;
    }
    const heightPresent = flags & 0x800;
    if (heightPresent) {
        const height = applyDecimalExponent(view.getUint16(index, true), isImperial ? -1 : -3);
        measurement = Object.assign({}, measurement, { height });
    }
    const multiplePacketMeasurement = !!(flags & 1000);
    measurement = Object.assign({}, measurement, { multiplePacketMeasurement });
    return measurement;
};
//# sourceMappingURL=body-composition-measurement.js.map