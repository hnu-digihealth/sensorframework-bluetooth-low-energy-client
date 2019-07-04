import { WebPlugin } from '@capacitor/core';
import {
  BluetoothGATTAvailabilityResult,
  BluetoothGATTCharacteristicReadOptions,
  BluetoothGATTCharacteristicReadResult,
  BluetoothGATTCharacteristicWriteOptions,
  BluetoothGATTCharacteristicWriteResult,
  BluetoothGATTConnectOptions,
  BluetoothGATTConnectResult,
  BluetoothGATTDescriptorReadOptions,
  BluetoothGATTDescriptorReadResult,
  BluetoothGATTDescriptorWriteOptions,
  BluetoothGATTDescriptorWriteResult,
  BluetoothGATTDisableNotificationsResult,
  BluetoothGATTDisconnectOptions,
  BluetoothGATTDisconnectResult,
  BluetoothGATTEnabledResult,
  BluetoothGATTEnableNotificationsResult,
  BluetoothGATTEnableResult,
  BluetoothGATTNotificationOptions,
  BluetoothGATTScanOptions,
  BluetoothGATTScanResults,
  BluetoothGATTServiceDiscoveryOptions,
  BluetoothGATTServiceDiscoveryResult,
  BluetoothLEClientPlugin,
  GATTCharacteristicProperties,
  GetCharacteristicOptions,
  GetCharacteristicResult,
  GetServiceOptions,
  GetServiceResult
} from './definitions';
import {get16BitUUID} from "./utils/utils";
import {BluetoothGattCharacteristics} from "./utils/ble-gatt-characteristics.enum";
import {NotConnectedError, OptionsRequiredError} from "./utils/errors";

const nav: Navigator = navigator;

export class BluetoothLEClientWeb extends WebPlugin implements BluetoothLEClientPlugin {

  private devices: Map<string, BluetoothDevice> = new Map();

  private connections: Map<string, any> = new Map();

  constructor() {
    super({
      name: 'BluetoothLEClient',
      platforms: ['web']
    });
  }

  /**
   * Returns {isAvailable: true} by default since there is no proper way to check whether Bluetooth is available
   */
  async isAvailable(): Promise<BluetoothGATTAvailabilityResult> {
    const isAvailable = true;
    return {isAvailable};
  }

  /**
   * Returns {enabled: true} by default since there is no proper way to check whether Bluetooth is enabled
   */
  async isEnabled(): Promise<BluetoothGATTEnabledResult>{
    const enabled = true;
    return {enabled};
  }

  /**
   * Returns {enabled: true} by default since there is no proper way to enable bluetooth from the web browser
   */
  async enable(): Promise<BluetoothGATTEnableResult>{
    return {enabled: true};
  }

  async scan(options: BluetoothGATTScanOptions): Promise<BluetoothGATTScanResults>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }



    const filters = options.services.map((service) => {
      return {services: [service]};
    });
    const optionalServices: number[] = options.services || [];

    try {

      const device = await nav.bluetooth.requestDevice({filters, optionalServices, acceptAllDevices: false});
      const {id, name} = device;
      this.devices.set(id, device);

      return {devices: [{name, id}]};

    } catch (e) {
      return Promise.reject(e);
    }
  }

  async connect( options: BluetoothGATTConnectOptions):Promise<BluetoothGATTConnectResult>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }

    const {id} = options;
    this.checkArgs({id});

    try {

      this.getConnection(id);
      return {connected: true};

    }catch (e) {

      try {

        const  device = this.devices.get(id);
        const gatt = await device.gatt.connect();
        const connection = new Map();
        connection.set("peripheral", gatt);
        this.connections.set(id, connection);

        return {connected: true};
      } catch (e) {
        return Promise.reject(e)
      }
    }

  }

  async disconnect(options: BluetoothGATTDisconnectOptions): Promise<BluetoothGATTDisconnectResult>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }

    const {id} = options;
    this.checkArgs({id});

    try {
      const connection = this.getConnection(id);
      const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");
      await gatt.disconnect()
      this.connections.delete(id);

      return {disconnected: true};
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async discover(options: BluetoothGATTServiceDiscoveryOptions): Promise<BluetoothGATTServiceDiscoveryResult>{

    console.log(options)
    return {discovered: true};
  }

  async read(options:BluetoothGATTCharacteristicReadOptions): Promise<BluetoothGATTCharacteristicReadResult>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }

    const {id, service, characteristic} = options;
    this.checkArgs({id, service, characteristic});

    try {
      const connection = this.connections.get(id);
      const gatt: BluetoothRemoteGATTServer = connection.get("peripheral") as BluetoothRemoteGATTServer;
      const gattService: BluetoothRemoteGATTService = await gatt.getPrimaryService(service);
      const gattCharacteristic: BluetoothRemoteGATTCharacteristic = await gattService.getCharacteristic(characteristic);

      const dataView = await gattCharacteristic.readValue();
      const value = [...new Uint8Array(dataView.buffer)];

      return {value};

    }catch (e) {
      return Promise.reject(e);
    }
  }

  async write(options: BluetoothGATTCharacteristicWriteOptions): Promise<BluetoothGATTCharacteristicWriteResult>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }

    const {id, service, characteristic, value} = options;
    this.checkArgs({id, service, characteristic, value});

    try {
      const connection = this.getConnection(id);
      const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");
      const gattService: BluetoothRemoteGATTService = await gatt.getPrimaryService(service);
      const gattCharacteristic: BluetoothRemoteGATTCharacteristic = await gattService.getCharacteristic(characteristic);

      const encoder = new TextEncoder();
      const toWrite = encoder.encode(value);

      await gattCharacteristic.writeValue(toWrite)

      return {
        value: [...(new Uint8Array(toWrite.buffer))]
      }
    }catch (e) {
      return Promise.reject(e);
    }



  }

  async readDescriptor(options: BluetoothGATTDescriptorReadOptions ):Promise<BluetoothGATTDescriptorReadResult>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }

    const {id, service, characteristic, descriptor} = options;

    this.checkArgs({id, service, characteristic, descriptor});

    try {
      const connection = this.getConnection(id);
      const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");
      const gattService: BluetoothRemoteGATTService = await gatt.getPrimaryService(service);
      const gattCharacteristic: BluetoothRemoteGATTCharacteristic = await gattService.getCharacteristic(characteristic);
      const gattDescriptor: BluetoothRemoteGATTDescriptor = await gattCharacteristic.getDescriptor(descriptor);

      const value = await gattDescriptor.readValue();

      return {
        value: [...(new Uint8Array(value.buffer))]
      }
    }catch (e) {
      return Promise.reject(e);
    }


  }

  async writeDescriptor(options: BluetoothGATTDescriptorWriteOptions): Promise<BluetoothGATTDescriptorWriteResult>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }

    const {id, service, characteristic, descriptor, value} = options;
    this.checkArgs({id, service, characteristic, descriptor, value});

    try {

      const connection = this.getConnection(id);
      const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");
      const gattService: BluetoothRemoteGATTService = await gatt.getPrimaryService(service);
      const gattCharacteristic: BluetoothRemoteGATTCharacteristic = await gattService.getCharacteristic(characteristic);
      const gattDescriptor: BluetoothRemoteGATTDescriptor = await gattCharacteristic.getDescriptor(descriptor);

      const encoder = new TextEncoder();
      const toWrite = encoder.encode(value);

      await gattDescriptor.writeValue(toWrite);

      return {
        value: [...(new Uint8Array(toWrite.buffer))]
      }

    }catch (e) {
      return Promise.reject(e);
    }



  }

  async enableNotifications( options: BluetoothGATTNotificationOptions ): Promise<BluetoothGATTEnableNotificationsResult>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }

    const {id, service, characteristic} = options;
    this.checkArgs({id, service, characteristic});

    try{
      const connection = this.getConnection(id);
      const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");
      const gattService: BluetoothRemoteGATTService = await gatt.getPrimaryService(service);
      let gattCharacterisic: BluetoothRemoteGATTCharacteristic = await gattService.getCharacteristic(characteristic);

      gattCharacterisic = await gattCharacterisic.startNotifications();

      gattCharacterisic.addEventListener("characteristicvaluechanged", (ev) => {

        const char: BluetoothRemoteGATTCharacteristic = (ev.target) as BluetoothRemoteGATTCharacteristic;
        const serv: BluetoothRemoteGATTService = char.service;
        const dev: BluetoothDevice = serv.device;
        const value = [...(new Uint8Array(char.value.buffer))];

        const meta = {
          id: dev.id,
          service: get16BitUUID(serv.uuid),
          characteristic: get16BitUUID(char.uuid)
        };

        this.notifyListeners(get16BitUUID(char.uuid).toString(), {...meta, value});
      });



      return {enabled: true};
    }catch (e) {
      return Promise.reject(e);
    }
  }

  async disableNotifications(options: BluetoothGATTNotificationOptions): Promise<BluetoothGATTDisableNotificationsResult>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }

    const {id, service, characteristic} = options;
    this.checkArgs({id, service, characteristic});

    try {
      const connection = this.getConnection(id);
      const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");
      const gattService: BluetoothRemoteGATTService = await gatt.getPrimaryService(service);
      const gattCharacteristic: BluetoothRemoteGATTCharacteristic = await gattService.getCharacteristic(characteristic);
      await gattCharacteristic.stopNotifications();
      return {disabled: true};
    } catch (e) {
      return Promise.reject(e);
    }

  }

  async getServices(options: GetServiceOptions): Promise<GetServiceResult>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }

    const {id} = options;
    this.checkArgs({id});

    try {
      const connection = this.getConnection(id);
      const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");
      const gattServices: BluetoothRemoteGATTService[] = await gatt.getPrimaryServices();

      const services = await Promise.all(gattServices.map(async (service: BluetoothRemoteGATTService) => {

        const characteristics = await this.getIncludedCharacteristicUuids(service);

        return {
          uuid: get16BitUUID(service.uuid),
          isPrimary: service.isPrimary,
          characteristics
        };

      }));

      return {services};
    }catch (e) {
      return Promise.reject(e);
    }
  }

  async getService(options: GetServiceOptions): Promise<GetServiceResult>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }

    const {id, service} = options;
    this.checkArgs({id, service});

    try {
      const connection = this.getConnection(id);
      const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");
      const gattService = await gatt.getPrimaryService(service);
      const characteristics = await this.getIncludedCharacteristicUuids(gattService);

      const {uuid, isPrimary} = gattService;

      return {
        uuid: get16BitUUID(uuid),
        isPrimary,
        characteristics
      }
    } catch (e) {
      return Promise.reject(e);
    }



  }

  async getCharacteristics(options: GetCharacteristicOptions): Promise<GetCharacteristicResult>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }

    const {id, service} = options;

    this.checkArgs({id, service});

    try {
      const connection = this.getConnection(id);
      const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");
      const gattService = await gatt.getPrimaryService(service);
      const includedCharacteristics = await gattService.getCharacteristics();

      const characteristics = await Promise.all(includedCharacteristics.map(async (characteristic) => {

        const {uuid} = characteristic;

        const descriptors = await this.getIncludedDescriptorUuids(characteristic);
        const properties = this.getCharacteristicProperties(characteristic);

        return {
          uuid: get16BitUUID(uuid),
          properties,
          descriptors
        }

      }));

      return {characteristics};

    }catch (e) {
      return Promise.reject(e);
    }
  }

  async getCharacteristic(options: GetCharacteristicOptions): Promise<GetCharacteristicResult>{

    if(!options){
      return Promise.reject(new OptionsRequiredError());
    }

    const {id, service, characteristic} = options;

    this.checkArgs({id, service, characteristic});


    try {
      const connection = this.getConnection(id);
      const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");
      const gattService = await gatt.getPrimaryService(service);
      const gattCharacteristic = await gattService.getCharacteristic(characteristic);
      const descriptors = await this.getIncludedDescriptorUuids(gattCharacteristic);
      const properties = this.getCharacteristicProperties(gattCharacteristic);
      const uuid = get16BitUUID(gattCharacteristic.uuid);

      return {
        uuid,
        properties,
        descriptors
      }

    } catch (e) {
      return Promise.reject(e);
    }
  }

  private checkArgs(args: {[key: string]: any}): void{

    for(const key of Object.keys(args)){
      if(args.hasOwnProperty(key)){
        if(!args[key]){
          throw new Error(`Property ${key} is required`);
        }
      }
    }

  }

  private getConnection(id: string): Map<string, any> {

    const connection = this.connections.get(id);

    if(!connection){
      throw new NotConnectedError();
    }

    return connection;
  }

  private getCharacteristicProperties(characteristic: BluetoothRemoteGATTCharacteristic): GATTCharacteristicProperties {

    return {
      authenticatedSignedWrites: characteristic.properties.authenticatedSignedWrites,
      broadcast: characteristic.properties.broadcast,
      indicate: characteristic.properties.indicate,
      notify: characteristic.properties.notify,
      read: characteristic.properties.read,
      reliableWrite: characteristic.properties.reliableWrite,
      writableAuxiliaries: characteristic.properties.writableAuxiliaries,
      write: characteristic.properties.write,
      writeWithoutResponse: characteristic.properties.writeWithoutResponse
    };
  }

  private async getIncludedCharacteristicUuids(service: BluetoothRemoteGATTService): Promise<Array<BluetoothGattCharacteristics | number>> {
    let characteristics: BluetoothRemoteGATTCharacteristic[] = [];

    try {
      characteristics = await service.getCharacteristics();
    }catch (e) {
      return Promise.reject(e);
    }

    return characteristics.map((characteristic) => get16BitUUID(characteristic.uuid));
  }

  private async getIncludedDescriptorUuids(characteristic: BluetoothRemoteGATTCharacteristic): Promise<number[]>{

    let descriptors: BluetoothRemoteGATTDescriptor [] = [];

    try {
      descriptors = await characteristic.getDescriptors();
    }catch (e) {
      console.log(e);
    }

    return descriptors.map((descriptor) => get16BitUUID(descriptor.uuid));
  }



}

const BluetoothLEClient = new BluetoothLEClientWeb();

export { BluetoothLEClient };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(BluetoothLEClient);
