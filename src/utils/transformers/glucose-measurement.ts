import {BluetoothGATTByteData, BluetoothGATTCallback} from "../../definitions";
import {getSFloat, toDataView} from "../utils";

export const GlucoseMeasurementCallback: BluetoothGATTCallback = (data: BluetoothGATTByteData) => {

    const view = toDataView(data);

    const flags = view.getUint8(0);

    let index = 1;
    let measurement = {};

    const sequenceNumber = view.getUint16(index, true);
    index += 2;

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

    const baseTime = new Date(year, month, day, hours, minutes, seconds);

    measurement = {...measurement, sequenceNumber, baseTime};

    const timeOffsetPresent = flags & 0x1;

    if(timeOffsetPresent){
        const timeOffset = view.getInt16(index, true);
        measurement = {...measurement, timeOffset};
        index += 2;
    }

    const concentrationTypeAndSampleLocationPresent = flags & 0x2;

    if(concentrationTypeAndSampleLocationPresent){

        const glucoseConcentrationUnit = (flags & 0x4) ? "mol/L" : "kg/L";

        const glucoseConcentration = getSFloat(view, index);
        index += 2;

        const sampleAndLocationByte = view.getUint8(index);
        index += 1;

        const type = sampleAndLocationByte & 0xF;
        const sampleLocation = (sampleAndLocationByte >> 4) & 0xF;

        measurement = {...measurement, glucoseConcentrationUnit, glucoseConcentration, type, sampleLocation};
    }

    const sensorStatusAnnunciationPresent = flags & 0x8;

    if(sensorStatusAnnunciationPresent){

        const sensorStatusBits = view.getUint16(index, true);
        index += 2;

        const sensorStatus = {
            batteryLow: !!(sensorStatusBits & 0x1),
            sensorMalfunction: !!(sensorStatusBits & 0x2),
            sampleSizeInsufficient: !!(sensorStatusBits & 0x4),
            stripInsertionError: !!(sensorStatusBits & 0x8),
            stripTypeIncorrect: !!(sensorStatusBits & 0x10),
            sensorResultTooHigh: !!(sensorStatusBits & 0x20),
            sensorResultTooLow: !!(sensorStatusBits & 0x40),
            sensorTemperatureTooHigh: !!(sensorStatusBits & 0x80),
            sensorTemperatureTooLow: !!(sensorStatusBits & 0x100),
            stripPulledTooSoon: !!(sensorStatusBits & 0x200),
            generalDeviceFault: !!(sensorStatusBits & 0x400),
            timeFault: !!(sensorStatusBits & 0x800)
        };

        measurement = {...measurement, sensorStatus};
    }

    const contextInformationFollows = !!(flags & 0x10);
    measurement = {...measurement, contextInformationFollows};

    return measurement;
};
