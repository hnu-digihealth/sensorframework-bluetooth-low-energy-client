import {BluetoothGATTByteData, BluetoothGATTCallback} from "../../definitions";
import {toDataView} from "../utils";

export const BodyCompositionMeasurementCallback: BluetoothGATTCallback = (data: BluetoothGATTByteData) => {

    const view = toDataView(data);

    const flags = view.getUint16(0, true);

    let index = 2;
    let measurement = {};

    const units = (flags & 0x1) ? {weight: "lb", height: "inch"} : {weight: "kg", height: "m"};
    measurement = {...measurement, units};

    const bodyFatPercentage = view.getUint16(index, true);
    measurement = {...measurement, bodyFatPercentage};
    index += 2;

    const timeStampPresent = flags & 0x2;

    if(timeStampPresent){

        const year = view.getUint16(index, true);
        index += 2;

        // Months start at 0 in JS
        const month = view.getUint8(index) - 1;
        index +=1;

        const day = view.getUint8(index);
        index +=1;

        const hours = view.getUint8(index);
        index +=1;

        const minutes = view.getUint8(index);
        index += 1;

        const seconds = view.getUint8(index);
        index +=1;

        const timestamp = new Date(year, month, day, hours, minutes, seconds);

        measurement = {...measurement, timestamp};

    }

    const userIdPresent = flags & 0x4;

    if(userIdPresent){

        const userId = view.getUint8(index);
        measurement = {...measurement, userId};

        index +=1;
    }

    const basalMetabolismPresent = flags & 0x8;

    if(basalMetabolismPresent){
        //unit kilo Joules
        const basalMetabolism = view.getUint16(index, true);
        measurement = {...measurement, basalMetabolism};
        index += 2;
    }

    const musclePercentagePresent = flags & 0x10;

    if(musclePercentagePresent){
        const musclePercentage = view.getUint16(index, true);
        measurement = {...measurement, musclePercentage};
        index += 2;
    }

    const muscleMassPresent = flags & 0x20;

    if(muscleMassPresent){
        const muscleMass = view.getUint16(index, true);
        measurement = {...measurement, muscleMass};
        index += 2;
    }

    const fatFreeMassPresent = flags & 0x40;

    if(fatFreeMassPresent){
        const fatFreeMass = view.getUint16(index, true);
        measurement = {...measurement, fatFreeMass};
        index += 2;
    }

    const softLeanMassPresent = flags & 0x80;

    if(softLeanMassPresent){
        const softLeanMass = view.getUint16(index, true);
        measurement = {...measurement, softLeanMass};
        index += 2;
    }

    const bodyWaterMassPresent = flags & 0x100;

    if(bodyWaterMassPresent){
        const bodyWaterMass = view.getUint16(index, true);
        measurement = {...measurement, bodyWaterMass};
        index += 2;
    }

    const impedancePresent = flags & 0x200;

    if(impedancePresent){
        const impedance = view.getUint16(index, true);
        measurement = {...measurement, impedance};
        index += 2;
    }

    const weightPresent = flags & 0x400;

    if(weightPresent){
        const weight = view.getUint16(index, true);
        measurement = {...measurement, weight};
        index += 2;
    }

    const heightPresent = flags & 0x800;

    if(heightPresent){
        const height = view.getUint16(index, true);
        measurement = {...measurement, height};
    }

    const multiplePacketMeasurement = !!(flags & 1000);
    measurement = {...measurement, multiplePacketMeasurement};

    return measurement;

};
