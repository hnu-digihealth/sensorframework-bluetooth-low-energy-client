import {BluetoothGATTByteData, BluetoothGATTCallback} from "../../definitions";
import {toDataView} from "../utils";

export const WeightScaleFeatureCallback: BluetoothGATTCallback = (data: BluetoothGATTByteData) => {

    const view = toDataView(data);

    const weightScaleFeatureBits = view.getUint32(0, true);

    return {
        timstampSupported: !!(weightScaleFeatureBits & 0x1),
        multipleUsersSupported: !!(weightScaleFeatureBits & 0x2),
        bmiSupported: !!(weightScaleFeatureBits & 0x4),
        weightMeasurementResolution: ((weightScaleFeatureBits >> 3) & 0xF),
        heightMeasurementResolution: ((weightScaleFeatureBits >> 7) & 0x7)
    };

};
