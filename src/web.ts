import { WebPlugin } from '@capacitor/core';
import {
  BluetoothGATTCharacteristicReadOptions,
  BluetoothGATTCharacteristicReadResult,
  BluetoothGATTCharacteristicWriteOptions,
  BluetoothGATTCharacteristicWriteResult, BluetoothGATTConnectOptions, BluetoothGATTConnectResult,
  BluetoothGATTDescriptorReadOptions,
  BluetoothGATTDescriptorReadResult,
  BluetoothGATTDescriptorWriteOptions,
  BluetoothGATTDescriptorWriteResult,
  BluetoothGATTDisconnectOptions,
  BluetoothGATTDisconnectResult,
  BluetoothGATTNotificationOptions, BluetoothGATTScanOptions, BluetoothGATTScanResults,
  BluetoothGATTServiceDiscoveryOptions,
  BluetoothLEClientPlugin,
  GATTCharacteristicProperties,
  GetCharacteristicOptions,
  GetCharacteristicResult,
  GetServiceOptions,
  GetServiceResult
} from './definitions';

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

  async isAvailable(): Promise<{isAvailable: boolean}> {
    const isAvailable = true;//await nav.bluetooth.getAvailability();
    return {isAvailable};
  }

  async isEnabled(): Promise<{enabled: boolean}>{
    console.warn("Mehod not available in browser");
    return;
  }

  async scan(options: BluetoothGATTScanOptions): Promise<BluetoothGATTScanResults>{
    let device: BluetoothDevice;

    const filters = options.services.map((service) => {
      return {services: [service]};
    });
    const optionalServices: number[] = options.services || [];

    try {

      device = await nav.bluetooth.requestDevice({filters, optionalServices, acceptAllDevices: false});
      const {id, name} = device;
      this.devices.set(id, device);

      return {devices: [{name, id}]};

    } catch (e) {
      return Promise.reject(e);
    }
  }

  async connect( options: BluetoothGATTConnectOptions):Promise<BluetoothGATTConnectResult>{

    const {id} = options;
    this.checkArgs({id});

    let gatt: BluetoothRemoteGATTServer;

    let connection: Map<string, any> = this.getConnection(id);

    try {

      if(connection){
        return {connected: true};
      } else {
        const  device = this.devices.get(id);
        gatt = await device.gatt.connect();
      }
    }catch (e) {
      return Promise.reject(e);
    }

    connection = new Map();
    connection.set("peripheral", gatt);
    this.connections.set(id, connection);

    return {connected: true};

  }

  async disconnect(options: BluetoothGATTDisconnectOptions): Promise<BluetoothGATTDisconnectResult>{

    const {id} = options;
    this.checkArgs({id});


    const connection: Map<string, any> = this.getConnection(id);

    if(!connection){
      return Promise.reject(new Error("Not connected to peripheral"));
    }


    const gatt: BluetoothRemoteGATTServer = connection.get("peripheral") as BluetoothRemoteGATTServer;

    try {

      await gatt.disconnect()
      this.connections.delete(id);
      return {disconnected: true};

    } catch (e) {
      return Promise.reject(e);
    }

  }

  async discover(options: BluetoothGATTServiceDiscoveryOptions): Promise<any>{
    console.warn("Method not available in browser", options);
    return;
  }

  async read(options:BluetoothGATTCharacteristicReadOptions): Promise<BluetoothGATTCharacteristicReadResult>{
    const {id, service, characteristic} = options;
    this.checkArgs({id, service, characteristic});

    const connection: Map<string, any> = this.connections.get(id);

    if(!connection){
      return;
    }

    const gatt: BluetoothRemoteGATTServer = connection.get("peripheral") as BluetoothRemoteGATTServer;

    const gattService: BluetoothRemoteGATTService = await gatt.getPrimaryService(service);

    if(!gattService){
      return;
    }

    const gattCharacteristic: BluetoothRemoteGATTCharacteristic = await gattService.getCharacteristic(characteristic);

    if(!gattCharacteristic){
      return;
    }

    const dataView = await gattCharacteristic.readValue();

    const value = [...new Uint8Array(dataView.buffer)];

    return {value};
  }

  async write(options: BluetoothGATTCharacteristicWriteOptions): Promise<BluetoothGATTCharacteristicWriteResult>{

    const {id, service, characteristic, value} = options;
    this.checkArgs({id, service, characteristic, value});

    const connection = this.getConnection(id);

    if(!connection){
      return;
    }

    const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");

    const gattService: BluetoothRemoteGATTService = await gatt.getPrimaryService(service);

    if(!service){
      return;
    }

    const gattCharacteristic: BluetoothRemoteGATTCharacteristic = await gattService.getCharacteristic(characteristic);

    if(!characteristic){
      return;
    }

    const encoder = new TextEncoder();
    const toWrite = encoder.encode(value);

    await gattCharacteristic.writeValue(toWrite)

    return {
      value: [...(new Uint8Array(toWrite.buffer))]
    }

  }

  async readDescriptor(options: BluetoothGATTDescriptorReadOptions ):Promise<BluetoothGATTDescriptorReadResult>{

    const {id, service, characteristic, descriptor} = options;

    this.checkArgs({id, service, characteristic, descriptor});

    const connection = this.getConnection(id);

    if(!connection){
      return;
    }

    const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");

    const gattService: BluetoothRemoteGATTService = await gatt.getPrimaryService(service);

    if(!gattService){
      return;
    }

    const gattCharacteristic: BluetoothRemoteGATTCharacteristic = await gattService.getCharacteristic(characteristic);

    if(!gattCharacteristic){
      return;
    }

    const gattDescriptor: BluetoothRemoteGATTDescriptor = await gattCharacteristic.getDescriptor(descriptor);

    if(!gattDescriptor){
      return;
    }

    const value = await gattDescriptor.readValue();

    return {
      value: [...(new Uint8Array(value.buffer))]
    }

  }

  async writeDescriptor(options: BluetoothGATTDescriptorWriteOptions): Promise<BluetoothGATTDescriptorWriteResult>{
    const {id, service, characteristic, descriptor, value} = options;
    this.checkArgs({id, service, characteristic, descriptor, value});

    const connection = this.getConnection(id);

    if(!connection){
      return;
    }

    const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");

    const gattService: BluetoothRemoteGATTService = await gatt.getPrimaryService(service);

    if(!service){
      return;
    }

    const gattCharacteristic: BluetoothRemoteGATTCharacteristic = await gattService.getCharacteristic(characteristic);

    if(!characteristic){
      return;
    }

    const gattDescriptor: BluetoothRemoteGATTDescriptor = await gattCharacteristic.getDescriptor(descriptor);

    if(!descriptor){
      return;
    }

    const encoder = new TextEncoder();
    const toWrite = encoder.encode(value);

    await gattDescriptor.writeValue(toWrite);

    return {
      value: [...(new Uint8Array(toWrite.buffer))]
    }

  }

  async enableNotifications( options: BluetoothGATTNotificationOptions ): Promise<any>{

    const {id, service, characteristic} = options;
    this.checkArgs({id, service, characteristic});

    const connection = this.getConnection(id);

    if(!connection){
      return;
    }

    const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");

    const gattService: BluetoothRemoteGATTService = await gatt.getPrimaryService(service);

    if(!gattService){
      return;
    }

    const gattCharacterisic: BluetoothRemoteGATTCharacteristic = await gattService.getCharacteristic(characteristic);



    if(!gattCharacterisic){
      return;
    }

    try {
      await gattCharacterisic.startNotifications();
    }catch (e) {
      console.error("Unable to enable noifications", e)
      return Promise.reject();
    }

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



    return;
  }

  async disableNotifications(options: BluetoothGATTNotificationOptions): Promise<any>{
    const {id, service, characteristic} = options;
    this.checkArgs({id, service, characteristic});

    const connection = this.getConnection(id);

    if(!connection){
      return;
    }

    const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");

    const gattService: BluetoothRemoteGATTService = await gatt.getPrimaryService(service);

    if(!gattService){
      return;
    }

    const gattCharacterisic: BluetoothRemoteGATTCharacteristic = await gattService.getCharacteristic(characteristic);



    if(!gattCharacterisic){
      return;
    }

    try {
      await gattCharacterisic.stopNotifications();
    }catch (e) {
      console.error("Unable to disableenable noifications", e);
      return Promise.reject();
    }

    return;
  }

  async getServices(options: GetServiceOptions): Promise<GetServiceResult>{

    const {id} = options;
    this.checkArgs({id});

    const connection = this.getConnection(id);

    if(!connection){
      return;
    }

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
  }

  async getService(options: GetServiceOptions): Promise<GetServiceResult>{

    const {id, service} = options;
    this.checkArgs({id, service});

    const connection = this.getConnection(id);

    if(!connection){
      return;
    }

    const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");

    const gattService = await gatt.getPrimaryService(service);

    if(!gattService){
      return;
    }

    const characteristics = await this.getIncludedCharacteristicUuids(gattService);

    const {uuid, isPrimary} = gattService;

    return {
      uuid: get16BitUUID(uuid),
      isPrimary,
      characteristics
    }

  }

  async getCharacteristics(options: GetCharacteristicOptions): Promise<GetCharacteristicResult>{

    const {id, service} = options;

    this.checkArgs({id, service});

    const connection = this.getConnection(id);

    if(!connection){
      return;
    }

    const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");

    const gattService = await gatt.getPrimaryService(service);

    if(!gattService){
      return;
    }

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

  }

  async getCharacteristic(options: GetCharacteristicOptions): Promise<GetCharacteristicResult>{

    const {id, service, characteristic} = options;

    this.checkArgs({id, service, characteristic});

    const connection = this.getConnection(id);

    if(!connection){
      return;
    }

    const gatt: BluetoothRemoteGATTServer = connection.get("peripheral");

    const gattService = await gatt.getPrimaryService(service);

    if(!gattService){
      return;
    }

    const gattCharacterisic = await gattService.getCharacteristic(characteristic);

    if(!gattCharacterisic){
      return;
    }

    const descriptors = await this.getIncludedDescriptorUuids(gattCharacterisic);
    const properties = this.getCharacteristicProperties(gattCharacterisic);
    const uuid = get16BitUUID(gattCharacterisic.uuid);

    return {
      uuid,
      properties,
      descriptors
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
    return this.connections.get(id);
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
      console.log(e);
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
import {get16BitUUID} from "./utils/utils";
import {BluetoothGattCharacteristics} from "./utils/ble-gatt-characteristics.enum";
registerWebPlugin(BluetoothLEClient);
