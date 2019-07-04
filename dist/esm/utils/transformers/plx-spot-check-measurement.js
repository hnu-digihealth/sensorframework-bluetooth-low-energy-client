import { getSFloat, toDataView } from "../utils";
export const PLXSpotCheckMeasurementCallback = (data) => {
    const view = toDataView(data);
    const flags = view.getUint8(0);
    let index = 1;
    let measurement = {};
    const deviceClockNotSet = !!(flags & 0x10);
    const spO2 = getSFloat(view, index);
    index += 2;
    const pr = getSFloat(view, index);
    index += 2;
    measurement = Object.assign({}, measurement, { spO2, pr, deviceClockNotSet });
    const timestampPresent = flags & 0x1;
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
    const measurementStatusPresent = flags & 0x2;
    if (measurementStatusPresent) {
        const measurementStatusBits = view.getUint16(index, true);
        const measurementStatus = {
            measurementOngoing: !!(measurementStatusBits & 0x20),
            earlyEstimatedData: !!(measurementStatusBits & 0x40),
            validatedData: !!(measurementStatusBits & 0x80),
            fullyQualifiedData: !!(measurementStatusBits & 0x100),
            dataFromMeasurementStorage: !!(measurementStatusBits & 0x200),
            dataForDemonstration: !!(measurementStatusBits & 0x400),
            dataForTesting: !!(measurementStatusBits & 0x800),
            calibrationOngoing: !!(measurementStatusBits & 0x1000),
            measurementUnavailable: !!(measurementStatusBits & 0x2000),
            questionablePulseDetected: !!(measurementStatusBits & 0x4000),
            invalidMeasurementDetected: !!(measurementStatusBits & 0x8000)
        };
        measurement = Object.assign({}, measurement, { measurementStatus });
        index += 2;
    }
    const deviceAndSensorStatusFieldPresent = flags & 0x4;
    if (deviceAndSensorStatusFieldPresent) {
        const deviceAndSensorStatusBitsLSB = view.getUint16(index, true);
        const deviceAndSensorStatusBitsMSB = view.getUint8(index + 2);
        const deviceAndSensorStatusBits = (deviceAndSensorStatusBitsMSB << 16) + deviceAndSensorStatusBitsLSB;
        const deviceAndSensorStatus = {
            extendedDisplayUpdateOngoing: !!(deviceAndSensorStatusBits & 0x1),
            equipmentMalfunctionDetected: !!(deviceAndSensorStatusBits & 0x2),
            signalProcessingIrregularityDetected: !!(deviceAndSensorStatusBits & 0x4),
            inadequiteSignalDetected: !!(deviceAndSensorStatusBits & 0x8),
            poorSignalDetected: !!(deviceAndSensorStatusBits & 0x10),
            lowPerfusionDetected: !!(deviceAndSensorStatusBits & 0x20),
            erraticSignalDetected: !!(deviceAndSensorStatusBits & 0x40),
            nonpulsatileSignalDetected: !!(deviceAndSensorStatusBits & 0x80),
            questionablePulseDetected: !!(deviceAndSensorStatusBits & 0x100),
            signalAnalysisOngoing: !!(deviceAndSensorStatusBits & 0x200),
            sensorInterfaceDetected: !!(deviceAndSensorStatusBits & 0x400),
            sensorUnconnectedToUser: !!(deviceAndSensorStatusBits & 0x800),
            unknownSensorConnected: !!(deviceAndSensorStatusBits & 0x1000),
            sensorDisplaced: !!(deviceAndSensorStatusBits & 0x2000),
            sensorMalfunctioning: !!(deviceAndSensorStatusBits & 0x4000),
            sensorDisconnected: !!(deviceAndSensorStatusBits & 0x8000)
        };
        measurement = Object.assign({}, measurement, { deviceAndSensorStatus });
        index += 3;
    }
    const pulseAmplitudeIndexFieldPresent = flags & 0x8;
    if (pulseAmplitudeIndexFieldPresent) {
        const pulseAmplitudeIndex = getSFloat(view, index);
        measurement = Object.assign({}, measurement, { pulseAmplitudeIndex });
    }
    return measurement;
};
//# sourceMappingURL=plx-spot-check-measurement.js.map