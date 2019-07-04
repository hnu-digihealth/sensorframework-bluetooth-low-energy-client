import { getSFloat, toDataView } from "../utils";
export const BloodPressureMeasurementCallback = (data) => {
    const view = toDataView(data);
    const flags = view.getUint8(0);
    let measurement = {};
    const unit = (flags & 0x1) ? "kPa" : "mmHg";
    measurement = Object.assign({}, measurement, { unit });
    let index = 1;
    //TODO: Check how to apply decimal exponent when unit is kPa
    const systolic = getSFloat(view, index);
    const diastolic = getSFloat(view, index + 2);
    const meanArterialPressure = getSFloat(view, index + 4);
    const compoundValue = { systolic, diastolic, meanArterialPressure };
    measurement = Object.assign({}, measurement, { compoundValue });
    index += 6;
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
    const pulseRatePresent = flags & 0x4;
    if (pulseRatePresent) {
        const pulse = getSFloat(view, index);
        measurement = Object.assign({}, measurement, { pulse });
        index += 2;
    }
    const userIdPresent = flags & 0x8;
    if (userIdPresent) {
        const userId = view.getUint8(index);
        measurement = Object.assign({}, measurement, { userId });
        index += 1;
    }
    const measurementStatusPresent = flags & 0x10;
    if (measurementStatusPresent) {
        const measurementStatus = view.getUint16(index, true);
        const bodyMovement = !!(measurementStatus & 0x1);
        const cuffTooLose = !!(measurementStatus & 0x2);
        const irregularPulse = !!(measurementStatus & 0x4);
        //TODO: Pulse range detection flags
        const improperPosition = !!(measurementStatus & 0x20);
        const status = {
            bodyMovement,
            cuffTooLose,
            irregularPulse,
            improperPosition
        };
        measurement = Object.assign({}, measurement, { status });
    }
    return measurement;
};
//# sourceMappingURL=blood-pressure-measurement.js.map