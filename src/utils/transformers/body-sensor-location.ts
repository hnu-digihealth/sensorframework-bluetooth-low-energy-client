import {BluetoothGATTByteData, BluetoothGATTCallback} from "../../definitions";
import {toDataView} from "../utils";

export const BodySensorLocationCallback: BluetoothGATTCallback = (data: BluetoothGATTByteData) => {

    const view = toDataView(data);
    const bodySensorLocation = view.getUint8(0);

    return bodySensorLocation;

};
