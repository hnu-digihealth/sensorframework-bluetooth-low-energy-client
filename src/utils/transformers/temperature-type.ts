import {BluetoothGATTByteData, BluetoothGATTCallback} from "../../definitions";
import {toDataView} from "../utils";

export const TemperatureTypeCallback: BluetoothGATTCallback = (data: BluetoothGATTByteData) => {

    const view = toDataView(data);
    const type = view.getUint8(0);

    return type;
};


