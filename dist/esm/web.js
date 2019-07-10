var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebPlugin } from '@capacitor/core';
import { get16BitUUID } from "./utils/utils";
import { NotConnectedError, OptionsRequiredError } from "./utils/errors";
const nav = navigator;
export class BluetoothLEClientWeb extends WebPlugin {
    constructor() {
        super({
            name: 'BluetoothLEClient',
            platforms: ['web']
        });
        this.devices = new Map();
        this.connections = new Map();
    }
    /**
     * Returns {isAvailable: true} by default since there is no proper way to check whether Bluetooth is available
     */
    isAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            const isAvailable = true;
            return { isAvailable };
        });
    }
    /**
     * Returns {enabled: true} by default since there is no proper way to check whether Bluetooth is enabled
     */
    isEnabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const enabled = true;
            return { enabled };
        });
    }
    /**
     * Returns {enabled: true} by default since there is no proper way to enable bluetooth from the web browser
     */
    enable() {
        return __awaiter(this, void 0, void 0, function* () {
            return { enabled: true };
        });
    }
    scan(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const filters = options.services.map((service) => {
                return { services: [service] };
            });
            const optionalServices = options.services || [];
            try {
                const device = yield nav.bluetooth.requestDevice({ filters, optionalServices, acceptAllDevices: false });
                const { id, name } = device;
                this.devices.set(id, device);
                return { devices: [{ name, id }] };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const { id } = options;
            this.checkArgs({ id });
            try {
                this.getConnection(id);
                return { connected: true };
            }
            catch (e) {
                try {
                    const device = this.devices.get(id);
                    const gatt = yield device.gatt.connect();
                    const connection = new Map();
                    connection.set("peripheral", gatt);
                    this.connections.set(id, connection);
                    return { connected: true };
                }
                catch (e) {
                    return Promise.reject(e);
                }
            }
        });
    }
    disconnect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const { id } = options;
            this.checkArgs({ id });
            try {
                const connection = this.getConnection(id);
                const gatt = connection.get("peripheral");
                yield gatt.disconnect();
                this.connections.delete(id);
                return { disconnected: true };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    discover(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return { discovered: true };
        });
    }
    read(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const { id, service, characteristic } = options;
            this.checkArgs({ id, service, characteristic });
            try {
                const connection = this.connections.get(id);
                const gatt = connection.get("peripheral");
                const gattService = yield gatt.getPrimaryService(service);
                const gattCharacteristic = yield gattService.getCharacteristic(characteristic);
                const dataView = yield gattCharacteristic.readValue();
                const value = [...new Uint8Array(dataView.buffer)];
                return { value };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const { id, service, characteristic, value } = options;
            this.checkArgs({ id, service, characteristic, value });
            try {
                const connection = this.getConnection(id);
                const gatt = connection.get("peripheral");
                const gattService = yield gatt.getPrimaryService(service);
                const gattCharacteristic = yield gattService.getCharacteristic(characteristic);
                const encoder = new TextEncoder();
                const toWrite = encoder.encode(value);
                yield gattCharacteristic.writeValue(toWrite);
                return {
                    value: [...(new Uint8Array(toWrite.buffer))]
                };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    readDescriptor(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const { id, service, characteristic, descriptor } = options;
            this.checkArgs({ id, service, characteristic, descriptor });
            try {
                const connection = this.getConnection(id);
                const gatt = connection.get("peripheral");
                const gattService = yield gatt.getPrimaryService(service);
                const gattCharacteristic = yield gattService.getCharacteristic(characteristic);
                const gattDescriptor = yield gattCharacteristic.getDescriptor(descriptor);
                const value = yield gattDescriptor.readValue();
                return {
                    value: [...(new Uint8Array(value.buffer))]
                };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    writeDescriptor(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const { id, service, characteristic, descriptor, value } = options;
            this.checkArgs({ id, service, characteristic, descriptor, value });
            try {
                const connection = this.getConnection(id);
                const gatt = connection.get("peripheral");
                const gattService = yield gatt.getPrimaryService(service);
                const gattCharacteristic = yield gattService.getCharacteristic(characteristic);
                const gattDescriptor = yield gattCharacteristic.getDescriptor(descriptor);
                const encoder = new TextEncoder();
                const toWrite = encoder.encode(value);
                yield gattDescriptor.writeValue(toWrite);
                return {
                    value: [...(new Uint8Array(toWrite.buffer))]
                };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    enableNotifications(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const { id, service, characteristic } = options;
            this.checkArgs({ id, service, characteristic });
            try {
                const connection = this.getConnection(id);
                const gatt = connection.get("peripheral");
                const gattService = yield gatt.getPrimaryService(service);
                let gattCharacterisic = yield gattService.getCharacteristic(characteristic);
                gattCharacterisic = yield gattCharacterisic.startNotifications();
                gattCharacterisic.addEventListener("characteristicvaluechanged", (ev) => {
                    const char = (ev.target);
                    const serv = char.service;
                    const dev = serv.device;
                    const value = [...(new Uint8Array(char.value.buffer))];
                    const meta = {
                        id: dev.id,
                        service: get16BitUUID(serv.uuid),
                        characteristic: get16BitUUID(char.uuid)
                    };
                    this.notifyListeners(get16BitUUID(char.uuid).toString(), Object.assign({}, meta, { value }));
                });
                return { enabled: true };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    disableNotifications(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const { id, service, characteristic } = options;
            this.checkArgs({ id, service, characteristic });
            try {
                const connection = this.getConnection(id);
                const gatt = connection.get("peripheral");
                const gattService = yield gatt.getPrimaryService(service);
                const gattCharacteristic = yield gattService.getCharacteristic(characteristic);
                yield gattCharacteristic.stopNotifications();
                return { disabled: true };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    getServices(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const { id } = options;
            this.checkArgs({ id });
            try {
                const connection = this.getConnection(id);
                const gatt = connection.get("peripheral");
                const gattServices = yield gatt.getPrimaryServices();
                const services = yield Promise.all(gattServices.map((service) => __awaiter(this, void 0, void 0, function* () {
                    const characteristics = yield this.getIncludedCharacteristicUuids(service);
                    return {
                        uuid: get16BitUUID(service.uuid),
                        isPrimary: service.isPrimary,
                        characteristics
                    };
                })));
                return { services };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    getService(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const { id, service } = options;
            this.checkArgs({ id, service });
            try {
                const connection = this.getConnection(id);
                const gatt = connection.get("peripheral");
                const gattService = yield gatt.getPrimaryService(service);
                const characteristics = yield this.getIncludedCharacteristicUuids(gattService);
                const { uuid, isPrimary } = gattService;
                return {
                    uuid: get16BitUUID(uuid),
                    isPrimary,
                    characteristics
                };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    getCharacteristics(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const { id, service } = options;
            this.checkArgs({ id, service });
            try {
                const connection = this.getConnection(id);
                const gatt = connection.get("peripheral");
                const gattService = yield gatt.getPrimaryService(service);
                const includedCharacteristics = yield gattService.getCharacteristics();
                const characteristics = yield Promise.all(includedCharacteristics.map((characteristic) => __awaiter(this, void 0, void 0, function* () {
                    const { uuid } = characteristic;
                    const descriptors = yield this.getIncludedDescriptorUuids(characteristic);
                    const properties = this.getCharacteristicProperties(characteristic);
                    return {
                        uuid: get16BitUUID(uuid),
                        properties,
                        descriptors
                    };
                })));
                return { characteristics };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    getCharacteristic(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options) {
                return Promise.reject(new OptionsRequiredError());
            }
            const { id, service, characteristic } = options;
            this.checkArgs({ id, service, characteristic });
            try {
                const connection = this.getConnection(id);
                const gatt = connection.get("peripheral");
                const gattService = yield gatt.getPrimaryService(service);
                const gattCharacteristic = yield gattService.getCharacteristic(characteristic);
                const descriptors = yield this.getIncludedDescriptorUuids(gattCharacteristic);
                const properties = this.getCharacteristicProperties(gattCharacteristic);
                const uuid = get16BitUUID(gattCharacteristic.uuid);
                return {
                    uuid,
                    properties,
                    descriptors
                };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }
    checkArgs(args) {
        for (const key of Object.keys(args)) {
            if (args.hasOwnProperty(key)) {
                if (!args[key]) {
                    throw new Error(`Property ${key} is required`);
                }
            }
        }
    }
    getConnection(id) {
        const connection = this.connections.get(id);
        if (!connection) {
            throw new NotConnectedError();
        }
        return connection;
    }
    getCharacteristicProperties(characteristic) {
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
    getIncludedCharacteristicUuids(service) {
        return __awaiter(this, void 0, void 0, function* () {
            let characteristics = [];
            try {
                characteristics = yield service.getCharacteristics();
            }
            catch (e) {
                return Promise.reject(e);
            }
            return characteristics.map((characteristic) => get16BitUUID(characteristic.uuid));
        });
    }
    getIncludedDescriptorUuids(characteristic) {
        return __awaiter(this, void 0, void 0, function* () {
            let descriptors = [];
            try {
                descriptors = yield characteristic.getDescriptors();
            }
            catch (e) {
                console.log(e);
            }
            return descriptors.map((descriptor) => get16BitUUID(descriptor.uuid));
        });
    }
}
const BluetoothLEClient = new BluetoothLEClientWeb();
export { BluetoothLEClient };
import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(BluetoothLEClient);
//# sourceMappingURL=web.js.map