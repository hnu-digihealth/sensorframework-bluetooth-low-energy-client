import {BluetoothGattCharacteristics} from "./ble-gatt-characteristics.enum";
import {BluetoothGattServices} from "./ble-gatt-services.enum";
import {BluetoothGATTByteData} from "../definitions";

export const getEventName = (id: string, service: BluetoothGattServices | number, characteristic: BluetoothGattCharacteristics | number) => {
    return `${id}:${service}:${characteristic}`;
}



export type BluetoothGattNotificationCallback = (data: BluetoothGATTByteData) => any;
export type BluetoothGattNotificationCallbacks = {[characteristic: number]: BluetoothGattNotificationCallback};

export const Callbacks: BluetoothGattNotificationCallbacks = {

    [BluetoothGattCharacteristics.BATTERY_LEVEL]: (data: BluetoothGATTByteData) => data[0],

    [BluetoothGattCharacteristics.BODY_SENSOR_LOCATION]: (data: BluetoothGATTByteData) => data[0],

    [BluetoothGattCharacteristics.HEART_RATE_MEASUREMENT]: (data: BluetoothGATTByteData) => {

        console.log(data);

        const flags = data[0];
        const type = ((flags >> 0) & 1) == 1 ? "UINT16" : "UINT8";
        const value = data[1];

        let measurement: {[key:string]: any} = {type, value};

        const energyExpendedBytePresent = ((flags >> 3) & 1) == 1;

        if(energyExpendedBytePresent){
          const energyExpended = {
              value: data[2],
              unit: "JOULE"
          };
          measurement = {...measurement, energyExpended}
        }

        return measurement;
    }




}


