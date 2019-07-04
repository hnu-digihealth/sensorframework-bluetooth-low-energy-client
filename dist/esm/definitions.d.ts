import { BluetoothGattCharacteristics } from "./utils/ble-gatt-characteristics.enum";
import { BluetoothGattServices } from "./utils/ble-gatt-services.enum";
declare module "@capacitor/core" {
    interface PluginRegistry {
        BluetoothLEClient: BluetoothLEClientPlugin;
    }
}
export interface BluetoothLEClientPlugin {
    isAvailable(): Promise<BluetoothGATTAvailabilityResult>;
    isEnabled(): Promise<BluetoothGATTEnabledResult>;
    enable(): Promise<BluetoothGATTEnableResult>;
    scan(options: BluetoothGATTScanOptions): Promise<BluetoothGATTScanResults>;
    connect(options: BluetoothGATTConnectOptions): Promise<BluetoothGATTConnectResult>;
    disconnect(options: BluetoothGATTDisconnectOptions): Promise<BluetoothGATTDisconnectResult>;
    read(options: BluetoothGATTCharacteristicReadOptions): Promise<BluetoothGATTCharacteristicReadResult>;
    write(options: BluetoothGATTCharacteristicWriteOptions): Promise<BluetoothGATTCharacteristicWriteResult>;
    readDescriptor(options: BluetoothGATTDescriptorReadOptions): Promise<BluetoothGATTDescriptorReadResult>;
    writeDescriptor(options: BluetoothGATTDescriptorWriteOptions): Promise<BluetoothGATTDescriptorWriteResult>;
    getServices(options: GetServiceOptions): Promise<GetServiceResult>;
    getService(options: GetServiceOptions): Promise<GetServiceResult>;
    getCharacteristics(options: GetCharacteristicOptions): Promise<GetCharacteristicResult>;
    getCharacteristic(options: GetCharacteristicOptions): Promise<GetCharacteristicResult>;
}
export declare type BluetoothGATTAvailabilityResult = {
    isAvailable: boolean;
};
export declare type BluetoothGATTEnabledResult = {
    enabled: boolean;
};
export declare type BluetoothGATTEnableResult = {
    enabled: boolean;
};
export declare type BluetoothGATTScanOptions = {
    services: Array<BluetoothGattServices | number>;
};
export declare type BluetoothGATTPeripheral = {
    name: string;
    id: string;
};
export declare type BluetoothGATTScanResults = {
    devices: BluetoothGATTPeripheral[];
};
export declare type BluetoothGATTConnectOptions = {
    id: string;
    autoConnect?: boolean;
};
export declare type BluetoothGATTConnectResult = {
    connected: true;
};
export declare type BluetoothGATTDisconnectOptions = {
    id: string;
};
export declare type BluetoothGATTDisconnectResult = {
    disconnected: true;
};
export declare type BluetoothGATTServiceDiscoveryOptions = {
    id: string;
};
export declare type BluetoothGATTServiceDiscoveryResult = {
    discovered: true;
};
export declare type BluetoothGATTByteData = number[];
export declare type BluetoothGATTCharacteristicReadOptions = {
    id: string;
    service: BluetoothGattServices | number;
    characteristic: BluetoothGattCharacteristics | number;
};
export declare type BluetoothGATTCharacteristicReadResult = {
    value: BluetoothGATTByteData;
};
export declare type BluetoothGATTCharacteristicWriteOptions = {
    id: string;
    service: BluetoothGattServices | number;
    characteristic: BluetoothGattCharacteristics | number;
    value: string;
};
export declare type BluetoothGATTCharacteristicWriteResult = {
    value: BluetoothGATTByteData;
};
export declare type BluetoothGATTDescriptorReadOptions = {
    id: string;
    service: BluetoothGattServices | number;
    characteristic: BluetoothGattCharacteristics | number;
    descriptor: number;
};
export declare type BluetoothGATTDescriptorReadResult = {
    value: BluetoothGATTByteData;
};
export declare type BluetoothGATTDescriptorWriteOptions = {
    id: string;
    service: BluetoothGattServices | number;
    characteristic: BluetoothGattCharacteristics | number;
    descriptor: number;
    value: string;
};
export declare type BluetoothGATTDescriptorWriteResult = {
    value: BluetoothGATTByteData;
};
export declare type BluetoothGATTNotificationOptions = {
    id: string;
    service: BluetoothGattServices | number;
    characteristic: BluetoothGattCharacteristics | number;
};
export declare type BluetoothGATTEnableNotificationsResult = {
    enabled: true;
};
export declare type BluetoothGATTDisableNotificationsResult = {
    disabled: true;
};
export declare type GetServiceOptions = {
    id: string;
    service?: BluetoothGattServices | number;
};
export declare type GATTService = {
    uuid: BluetoothGattServices | number;
    isPrimary: boolean;
    characteristics: Array<BluetoothGattCharacteristics | number>;
    included?: Array<BluetoothGattServices | number>;
};
export declare type GetServiceResult = GATTService | {
    services: GATTService[];
};
export declare type GetCharacteristicOptions = {
    id: string;
    service: BluetoothGattServices | number;
    characteristic?: BluetoothGattCharacteristics | number;
};
export declare type GATTCharacteristicProperties = {
    authenticatedSignedWrites: boolean;
    broadcast: boolean;
    indicate: boolean;
    notify: boolean;
    read: boolean;
    write: boolean;
    writeWithoutResponse: boolean;
    reliableWrite?: boolean;
    writableAuxiliaries?: boolean;
};
export declare type GATTCharacteristic = {
    uuid: BluetoothGattCharacteristics | number;
    properties: GATTCharacteristicProperties;
    descriptors: number[];
};
export declare type GetCharacteristicResult = GATTCharacteristic | {
    characteristics: GATTCharacteristic[];
};
export declare type BluetoothGATTCallback = (data: BluetoothGATTByteData) => any;
export declare type BluetoothGATTCallbacks = {
    [characteristic: number]: BluetoothGATTCallback;
};
