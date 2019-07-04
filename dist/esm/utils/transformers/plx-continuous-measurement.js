import { getSFloat, toDataView } from "../utils";
export const PLXContinuousMeasurementCallback = (data) => {
    const view = toDataView(data);
    const flags = view.getUint8(0);
    let index = 1;
    let measurement = {};
    const spO2 = getSFloat(view, index);
    index += 2;
    const pr = getSFloat(view, index);
    index += 2;
    measurement = Object.assign({}, measurement, { spO2, pr });
    const spO2PRFastPresent = flags & 0x1;
    if (spO2PRFastPresent) {
        const spO2Fast = getSFloat(view, index);
        index += 2;
        const prFast = getSFloat(view, index);
        index += 2;
        measurement = Object.assign({}, measurement, { spO2Fast, prFast });
    }
    const spO2PRSlowPresent = flags & 0x2;
    if (spO2PRSlowPresent) {
        const spO2Slow = getSFloat(view, index);
        index += 2;
        const prSlow = getSFloat(view, index);
        index += 2;
        measurement = Object.assign({}, measurement, { spO2Slow, prSlow });
    }
    const measurementStatusPresent = flags & 0x4;
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
    const deviceAndSensorStatusPresent = flags & 0x8;
    if (deviceAndSensorStatusPresent) {
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
    const pulseAmplitudeIndexFieldPresent = flags & 0x10;
    if (pulseAmplitudeIndexFieldPresent) {
        const pulseAmplitudeIndex = getSFloat(view, index);
        measurement = Object.assign({}, measurement, { pulseAmplitudeIndex });
    }
    return measurement;
};
//# sourceMappingURL=plx-continuous-measurement.js.map