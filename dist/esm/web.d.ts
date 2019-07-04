import { WebPlugin } from '@capacitor/core';
import { BluetoothGATTAvailabilityResult, BluetoothGATTCharacteristicReadOptions, BluetoothGATTCharacteristicReadResult, BluetoothGATTCharacteristicWriteOptions, BluetoothGATTCharacteristicWriteResult, BluetoothGATTConnectOptions, BluetoothGATTConnectResult, BluetoothGATTDescriptorReadOptions, BluetoothGATTDescriptorReadResult, BluetoothGATTDescriptorWriteOptions, BluetoothGATTDescriptorWriteResult, BluetoothGATTDisableNotificationsResult, BluetoothGATTDisconnectOptions, BluetoothGATTDisconnectResult, BluetoothGATTEnabledResult, BluetoothGATTEnableNotificationsResult, BluetoothGATTEnableResult, BluetoothGATTNotificationOptions, BluetoothGATTScanOptions, BluetoothGATTScanResults, BluetoothGATTServiceDiscoveryOptions, BluetoothGATTServiceDiscoveryResult, BluetoothLEClientPlugin, GetCharacteristicOptions, GetCharacteristicResult, GetServiceOptions, GetServiceResult } from './definitions';
export declare class BluetoothLEClientWeb extends WebPlugin implements BluetoothLEClientPlugin {
    private devices;
    private connections;
    constructor();
    /**
     * Returns {isAvailable: true} by default since there is no proper way to check whether Bluetooth is available
     */
    isAvailable(): Promise<BluetoothGATTAvailabilityResult>;
    /**
     * Returns {enabled: true} by default since there is no proper way to check whether Bluetooth is enabled
     */
    isEnabled(): Promise<BluetoothGATTEnabledResult>;
    /**
     * Returns {enabled: true} by default since there is no proper way to enable bluetooth from the web browser
     */
    enable(): Promise<BluetoothGATTEnableResult>;
    scan(options: BluetoothGATTScanOptions): Promise<BluetoothGATTScanResults>;
    connect(options: BluetoothGATTConnectOptions): Promise<BluetoothGATTConnectResult>;
    disconnect(options: BluetoothGATTDisconnectOptions): Promise<BluetoothGATTDisconnectResult>;
    discover(options: BluetoothGATTServiceDiscoveryOptions): Promise<BluetoothGATTServiceDiscoveryResult>;
    read(options: BluetoothGATTCharacteristicReadOptions): Promise<BluetoothGATTCharacteristicReadResult>;
    write(options: BluetoothGATTCharacteristicWriteOptions): Promise<BluetoothGATTCharacteristicWriteResult>;
    readDescriptor(options: BluetoothGATTDescriptorReadOptions): Promise<BluetoothGATTDescriptorReadResult>;
    writeDescriptor(options: BluetoothGATTDescriptorWriteOptions): Promise<BluetoothGATTDescriptorWriteResult>;
    enableNotifications(options: BluetoothGATTNotificationOptions): Promise<BluetoothGATTEnableNotificationsResult>;
    disableNotifications(options: BluetoothGATTNotificationOptions): Promise<BluetoothGATTDisableNotificationsResult>;
    getServices(options: GetServiceOptions): Promise<GetServiceResult>;
    getService(options: GetServiceOptions): Promise<GetServiceResult>;
    getCharacteristics(options: GetCharacteristicOptions): Promise<GetCharacteristicResult>;
    getCharacteristic(options: GetCharacteristicOptions): Promise<GetCharacteristicResult>;
    private checkArgs;
    private getConnection;
    private getCharacteristicProperties;
    private getIncludedCharacteristicUuids;
    private getIncludedDescriptorUuids;
}
declare const BluetoothLEClient: BluetoothLEClientWeb;
export { BluetoothLEClient };
