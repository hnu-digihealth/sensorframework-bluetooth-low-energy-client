import {BluetoothGattCharacteristics} from "./utils/ble-gatt-characteristics.enum";
import {BluetoothGattServices} from "./utils/ble-gatt-services.enum";
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

export type BluetoothGATTAvailabilityResult = {
  isAvailable: boolean
}

export type BluetoothGATTEnabledResult = {
  enabled: boolean
}

export type BluetoothGATTEnableResult = {
  enabled: boolean
}

export type BluetoothGATTScanOptions = {
  services: Array<BluetoothGattServices | number>
}

export type BluetoothGATTPeripheral = {
  name: string,
  id: string
}

export type BluetoothGATTScanResults = { devices: BluetoothGATTPeripheral[]}

export type BluetoothGATTConnectOptions = {
  id: string,
  autoConnect?: boolean
}

export type BluetoothGATTConnectResult = {
  connected: true;
}

export type BluetoothGATTDisconnectOptions = {
  id: string
}

export type BluetoothGATTDisconnectResult = {
  disconnected: true;
}

export type BluetoothGATTServiceDiscoveryOptions = {
  id: string
}

export type BluetoothGATTServiceDiscoveryResult = {
  discovered: true
}

export type BluetoothGATTByteData = number[];

export type BluetoothGATTCharacteristicReadOptions = {
  id: string,
  service: BluetoothGattServices | number,
  characteristic: BluetoothGattCharacteristics | number
}



export type BluetoothGATTCharacteristicReadResult = {value: BluetoothGATTByteData}

export type BluetoothGATTCharacteristicWriteOptions = {
  id: string,
  service: BluetoothGattServices | number,
  characteristic: BluetoothGattCharacteristics | number
  value: string
}

export type BluetoothGATTCharacteristicWriteResult = {value: BluetoothGATTByteData};

export type BluetoothGATTDescriptorReadOptions = {
  id: string,
  service: BluetoothGattServices | number,
  characteristic: BluetoothGattCharacteristics | number,
  descriptor: number
}

export type BluetoothGATTDescriptorReadResult = {value: BluetoothGATTByteData};

export type BluetoothGATTDescriptorWriteOptions = {
  id: string,
  service: BluetoothGattServices | number,
  characteristic: BluetoothGattCharacteristics | number,
  descriptor: number,
  value: string
}

export type BluetoothGATTDescriptorWriteResult = {value: BluetoothGATTByteData};

export type BluetoothGATTNotificationOptions = {
  id: string,
  service: BluetoothGattServices | number,
  characteristic: BluetoothGattCharacteristics | number,
}

export type BluetoothGATTEnableNotificationsResult = {
  enabled: true
}

export type BluetoothGATTDisableNotificationsResult = {
  disabled: true
}

export type GetServiceOptions = {
  id:string,
  service?: BluetoothGattServices | number
}

export type GATTService = {
  uuid: BluetoothGattServices | number,
  isPrimary: boolean,
  characteristics: Array<BluetoothGattCharacteristics | number>,
  included?: Array<BluetoothGattServices | number>
}

export type GetServiceResult = GATTService | {services: GATTService[]};

export type GetCharacteristicOptions = {
  id: string,
  service: BluetoothGattServices | number,
  characteristic?: BluetoothGattCharacteristics | number
}

export type GATTCharacteristicProperties = {
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

export type GATTCharacteristic = {
  uuid: BluetoothGattCharacteristics | number,
  properties: GATTCharacteristicProperties,
  descriptors: number[]
}

export type GetCharacteristicResult = GATTCharacteristic | {characteristics: GATTCharacteristic[]};

export type BluetoothGATTCallback = (data: BluetoothGATTByteData) => any;
export type BluetoothGATTCallbacks = {[characteristic: number]: BluetoothGATTCallback};

