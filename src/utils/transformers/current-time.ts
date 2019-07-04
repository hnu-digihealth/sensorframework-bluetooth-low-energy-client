import {BluetoothGATTByteData, BluetoothGATTCallback} from "../../definitions";
import {toDataView} from "../utils";

export const CurrentTimeCallback: BluetoothGATTCallback = (data: BluetoothGATTByteData) => {

    const view = toDataView(data);

    let index = 0;

    const year = view.getUint16(index, true);
    index += 2;

    //JS starts counting months at 0
    const month = view.getUint8(index) -1;
    index += 1;

    const day = view.getUint8(index);
    index += 1;

    const hours = view.getUint8(index);
    index += 1;

    const minutes = view.getUint8(index);
    index += 1;

    const seconds = view.getUint8(index);

    return new Date(year, month, day, hours, minutes, seconds);

}
