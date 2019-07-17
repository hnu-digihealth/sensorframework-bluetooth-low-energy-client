import { BluetoothGATTCharacteristics } from "./utils/ble-gatt-characteristics.enum";
import { BluetoothGATTServices } from "./utils/ble-gatt-services.enum";
import { WebPlugin } from "@capacitor/core";
declare module "@capacitor/core/dist/esm/core-plugin-definitions" {
    interface PluginRegistry {
        BluetoothLEClient: BluetoothLEClientPlugin;
    }
}
export interface BluetoothLEClientPlugin extends WebPlugin {
    isAvailable(): Promise<BluetoothGATTAvailabilityResult>;
    isEnabled(): Promise<BluetoothGATTEnabledResult>;
    enable(): Promise<BluetoothGATTEnableResult>;
    scan(options: BluetoothGATTScanOptions): Promise<BluetoothGATTScanResults>;
    connect(options: BluetoothGATTConnectOptions): Promise<BluetoothGATTConnectResult>;
    discover(options: BluetoothGATTServiceDiscoveryOptions): Promise<BluetoothGATTServiceDiscoveryResult>;
    disconnect(options: BluetoothGATTDisconnectOptions): Promise<BluetoothGATTDisconnectResult>;
    read(options: BluetoothGATTCharacteristicReadOptions): Promise<BluetoothGATTCharacteristicReadResult>;
    write(options: BluetoothGATTCharacteristicWriteOptions): Promise<BluetoothGATTCharacteristicWriteResult>;
    readDescriptor(options: BluetoothGATTDescriptorReadOptions): Promise<BluetoothGATTDescriptorReadResult>;
    writeDescriptor(options: BluetoothGATTDescriptorWriteOptions): Promise<BluetoothGATTDescriptorWriteResult>;
    getServices(options: GetServiceOptions): Promise<GetServiceResult>;
    getService(options: GetServiceOptions): Promise<GetServiceResult>;
    getCharacteristics(options: GetCharacteristicOptions): Promise<GetCharacteristicResult>;
    getCharacteristic(options: GetCharacteristicOptions): Promise<GetCharacteristicResult>;
    enableNotifications(options: BluetoothGATTNotificationOptions): Promise<BluetoothGATTEnableNotificationsResult>;
    disableNotifications(options: BluetoothGATTNotificationOptions): Promise<BluetoothGATTDisableNotificationsResult>;
}
export interface BluetoothGATTAvailabilityResult {
    isAvailable: boolean;
}
export interface BluetoothGATTEnabledResult {
    enabled: boolean;
}
export declare type BluetoothGATTEnableResult = {
    enabled: boolean;
};
export interface BluetoothGATTScanOptions {
    services: Array<BluetoothGATTServices | number>;
}
export interface BluetoothGATTPeripheral {
    name: string;
    id: string;
}
export interface BluetoothGATTScanResults {
    devices: BluetoothGATTPeripheral[];
}
export interface BluetoothGATTConnectOptions {
    id: string;
    autoConnect?: boolean;
}
export interface BluetoothGATTConnectResult {
    connected: true;
}
export interface BluetoothGATTDisconnectOptions {
    id: string;
}
export interface BluetoothGATTDisconnectResult {
    disconnected: true;
}
export interface BluetoothGATTServiceDiscoveryOptions {
    id: string;
}
export interface BluetoothGATTServiceDiscoveryResult {
    discovered: true;
}
export declare type BluetoothGATTByteData = number[];
export interface BluetoothGATTCharacteristicReadOptions {
    id: string;
    service: BluetoothGATTServices | number;
    characteristic: BluetoothGATTCharacteristics | number;
}
export interface BluetoothGATTCharacteristicReadResult {
    value: BluetoothGATTByteData;
}
export interface BluetoothGATTCharacteristicWriteOptions {
    id: string;
    service: BluetoothGATTServices | number;
    characteristic: BluetoothGATTCharacteristics | number;
    value: string;
}
export interface BluetoothGATTCharacteristicWriteResult {
    value: BluetoothGATTByteData;
}
export interface BluetoothGATTDescriptorReadOptions {
    id: string;
    service: BluetoothGATTServices | number;
    characteristic: BluetoothGATTCharacteristics | number;
    descriptor: number;
}
export interface BluetoothGATTDescriptorReadResult {
    value: BluetoothGATTByteData;
}
export interface BluetoothGATTDescriptorWriteOptions {
    id: string;
    service: BluetoothGATTServices | number;
    characteristic: BluetoothGATTCharacteristics | number;
    descriptor: number;
    value: string;
}
export interface BluetoothGATTDescriptorWriteResult {
    value: BluetoothGATTByteData;
}
export interface BluetoothGATTNotificationOptions {
    id: string;
    service: BluetoothGATTServices | number;
    characteristic: BluetoothGATTCharacteristics | number;
}
export interface BluetoothGATTEnableNotificationsResult {
    enabled: true;
}
export interface BluetoothGATTDisableNotificationsResult {
    disabled: true;
}
export interface GetServiceOptions {
    id: string;
    service?: BluetoothGATTServices | number;
}
export interface GATTService {
    uuid: BluetoothGATTServices | number;
    isPrimary: boolean;
    characteristics: Array<BluetoothGATTCharacteristics | number>;
    included?: Array<BluetoothGATTServices | number>;
}
export declare type GetServiceResult = GATTService | {
    services: GATTService[];
};
export interface GetCharacteristicOptions {
    id: string;
    service: BluetoothGATTServices | number;
    characteristic?: BluetoothGATTCharacteristics | number;
}
export interface GATTCharacteristicProperties {
    authenticatedSignedWrites: boolean;
    broadcast: boolean;
    indicate: boolean;
    notify: boolean;
    read: boolean;
    write: boolean;
    writeWithoutResponse: boolean;
    reliableWrite?: boolean;
    writableAuxiliaries?: boolean;
}
export interface GATTCharacteristic {
    uuid: BluetoothGATTCharacteristics | number;
    properties: GATTCharacteristicProperties;
    descriptors: number[];
}
export declare type GetCharacteristicResult = GATTCharacteristic | {
    characteristics: GATTCharacteristic[];
};
export declare type BluetoothGATTCallback = (data: BluetoothGATTByteData) => any;
export interface BluetoothGATTCallbacks {
    [characteristic: number]: BluetoothGATTCallback;
}
