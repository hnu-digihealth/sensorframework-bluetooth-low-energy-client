import {BluetoothGATTByteData, BluetoothGATTCallback} from "../../definitions";
import {toDataView} from "../utils";

export const TemperatureTypeCallback: BluetoothGATTCallback = (data: BluetoothGATTByteData) => {

    const view = toDataView(data);
    const type = view.getUint8(0);

    return type;
};

export enum TemperatureLocation{
    ARMPIT = 1,
    BODY = 2,
    EAR_LOBE = 3,
    FINGER = 4,
    GASTRO_INTESTINAL_TRACT = 5,
    MOUTH = 6,
    RECTUM = 7,
    TOE = 8,
    TYMPANUM = 9
}
