import {BluetoothGATTCharacteristics} from "./utils/ble-gatt-characteristics.enum";
import {BluetoothGATTServices} from "./utils/ble-gatt-services.enum";
import {WebPlugin} from "@capacitor/core";



declare module "@capacitor/core/dist/esm/core-plugin-definitions" {

  interface PluginRegistry {
    BluetoothLEClient: BluetoothLEClientPlugin;
  }
}

export interface BluetoothLEClientPlugin extends WebPlugin{

  isAvailable(): Promise<BluetoothGATTAvailabilityResult>;

  isEnabled(): Promise<BluetoothGATTEnabledResult>;

  enable(): Promise<BluetoothGATTEnableResult>;

  scan(options: BluetoothGATTScanOptions): Promise<BluetoothGATTScanResults>;

  connect(options: BluetoothGATTConnectOptions): Promise<BluetoothGATTConnectResult>;

  discover(options: BluetoothGATTServiceDiscoveryOptions): Promise<BluetoothGATTServiceDiscoveryResult>;

  disconnect(options: BluetoothGATTDisconnectOptions): Promise<BluetoothGATTDisconnectResult>

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

export type BluetoothGATTService = BluetoothGATTServices | number | string;
export type BluetoothGATTCharacteristic = BluetoothGATTCharacteristics | number | string;

export interface BluetoothGATTAvailabilityResult{
  isAvailable: boolean
}

export interface BluetoothGATTEnabledResult{
  enabled: boolean
}

export type BluetoothGATTEnableResult = {
  enabled: boolean
}

export interface BluetoothGATTScanOptions{
  services: Array<BluetoothGATTService>
  optionalServices: Array<BluetoothGATTService>
}

export interface BluetoothGATTPeripheral{
  name: string,
  id: string
}

export interface BluetoothGATTScanResults{
  devices: BluetoothGATTPeripheral[]
}

export interface BluetoothGATTConnectOptions{
  id: string,
  autoConnect?: boolean
}

export interface BluetoothGATTConnectResult{
  connected: true
}

export interface BluetoothGATTDisconnectOptions{
  id: string
}

export interface BluetoothGATTDisconnectResult{
  disconnected: true;
}

export interface BluetoothGATTServiceDiscoveryOptions{
  id: string
}

export interface BluetoothGATTServiceDiscoveryResult{
  discovered: true
}

export type BluetoothGATTByteData = number[];

export interface BluetoothGATTCharacteristicReadOptions{
  id: string,
  service: BluetoothGATTService,
  characteristic: BluetoothGATTCharacteristic
}



export interface BluetoothGATTCharacteristicReadResult{
  value: BluetoothGATTByteData
}

export interface BluetoothGATTCharacteristicWriteOptions{
  id: string,
  service: BluetoothGATTService,
  characteristic: BluetoothGATTCharacteristic
  value: string //Base64 encoded string of byte array
}

export interface BluetoothGATTCharacteristicWriteResult{
  value: BluetoothGATTByteData
}

export interface BluetoothGATTDescriptorReadOptions{
  id: string,
  service: BluetoothGATTService,
  characteristic: BluetoothGATTCharacteristic,
  descriptor: number
}

export interface BluetoothGATTDescriptorReadResult{
  value: BluetoothGATTByteData
}

export interface BluetoothGATTDescriptorWriteOptions{
  id: string,
  service: BluetoothGATTService,
  characteristic: BluetoothGATTCharacteristic,
  descriptor: number,
  value: string //Base64 encoded string of byte array
}

export interface BluetoothGATTDescriptorWriteResult{
  value: BluetoothGATTByteData
}

export interface BluetoothGATTNotificationOptions{
  id: string,
  service: BluetoothGATTService,
  characteristic: BluetoothGATTCharacteristic,
}

export interface BluetoothGATTEnableNotificationsResult{
  enabled: true
}

export interface BluetoothGATTDisableNotificationsResult{
  disabled: true
}

export interface GetServiceOptions{
  id:string,
  service?: BluetoothGATTService
}

export interface GATTService{
  uuid: string,
  isPrimary: boolean,
  characteristics: Array<BluetoothGATTCharacteristic>,
  included?: Array<BluetoothGATTService>
}

export type GetServiceResult = GATTService | {services: GATTService[]};

export interface GetCharacteristicOptions{
  id: string,
  service: BluetoothGATTService,
  characteristic?: BluetoothGATTCharacteristic
}

export interface GATTCharacteristicProperties{
  authenticatedSignedWrites: boolean,
  broadcast: boolean,
  indicate: boolean,
  notify: boolean,
  read: boolean,
  write: boolean,
  writeWithoutResponse: boolean
  reliableWrite?: boolean,
  writableAuxiliaries?: boolean,
}

export interface GATTCharacteristic{
  uuid: BluetoothGATTCharacteristic,
  properties: GATTCharacteristicProperties,
  descriptors: string[]
}

export type GetCharacteristicResult = GATTCharacteristic | {characteristics: GATTCharacteristic[]};

export type BluetoothGATTCallback = (data: BluetoothGATTByteData) => any;

export interface BluetoothGATTCallbacks{
  [characteristic: number]: BluetoothGATTCallback
}

