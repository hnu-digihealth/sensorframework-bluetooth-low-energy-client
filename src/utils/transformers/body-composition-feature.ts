import {BluetoothGATTByteData, BluetoothGATTCallback} from "../../definitions";
import {toDataView} from "../utils";

export const BodyCompositionFeatureCallback: BluetoothGATTCallback = (data: BluetoothGATTByteData) => {

    const view = toDataView(data);
    const flags = view.getUint32(0, true);

    return {
        timestampSupported: !!(flags & 0x1),
        multipleUsersSupported: !!(flags & 0x2),
        basalMetabolismSupported: !!(flags & 0x4),
        musclePercentageSupported: !!(flags & 0x8),
        muscleMassSupported: !!(flags & 0x10),
        fatFreeMassSupported: !!(flags & 0x20),
        softLeanMassSupported: !!(flags & 0x40),
        bodyWaterMassSupported: !!(flags & 0x80),
        impedanceSupported: !!(flags & 0x100),
        weightSupported: !!(flags & 0x200),
        heightSupported: !!(flags & 0x400),
        massMeasurementResolutionKey: (flags >> 11) & 0xF,
        heightMeasurementResolutionKey: (flags >> 15) & 0x7
    };

};
