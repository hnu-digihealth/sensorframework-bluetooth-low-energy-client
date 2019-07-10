import {BluetoothGATTByteData, BluetoothGATTCallback} from "../../definitions";
import {toDataView} from "../utils";

export const BodySensorLocationCallback: BluetoothGATTCallback = (data: BluetoothGATTByteData) => {

    const view = toDataView(data);
    const bodySensorLocation = view.getUint8(0);

    return bodySensorLocation;

};

export enum BodySensorLocation{
    OTHER = 0,
    CHEST = 1,
    WRIST = 2,
    FINGER = 3,
    HAND = 4,
    EAR_LOBE = 5,
    FOOT = 6
}
