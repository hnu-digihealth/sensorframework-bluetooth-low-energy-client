# BluetoothLEClient

[![npm version](https://badge.fury.io/js/cap-bluetooth-low-energy-client.svg)](https://badge.fury.io/js/cap-bluetooth-low-energy-client)
 
A client implementation for interacting with Bluetooth Low Energy peripherals.


Supported platforms  
 
- [x] Web  
- [x] Android  
- [ ] iOS  

## Usage

Install the plugin via npm  
```
npm install --save cap-bluetooth-low-energy-client
```

In your capacitor project, make sure to register the Android plugin in
in the projects `MainActivity` as follows

```java
import com.bleclient.plugin.BluetoothLEClient;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(BluetoothLEClient.class);
    }});
  }
}
```



```typescript
import {Plugins} from "@capacitor/core";

const {BluetoothLEClient} = Plugins;

//...do something with plugin

```

## API Documentation

Interface and type definitions can be found [here](./src/definitions.ts).

### isAvailable
`isAvailable(): Promise<BluetoothGATTAvailabilityResult>`  

Check wheter your device supports Bluetooth Low Energy.

*options* none  
*returns* `Promise<BluetoothGattAvailabilityResult>`

### isEnabled
`isEnabled(): Promise<BluetoothGATTEnabledResult>`  

Check whether or not Bluetooth is enabled on your device.

*options* none  
*returns* `Promise<BluetoothGATTEnabledResult>`  

### enable
`enable(): Promise<BluetoothGATTEnableResult>`  

Enable Bluetooth on your device.

Note: This method is only available for Android devices at the moment.
On other platforms (e.g. Web) the `enable()` method will simply resolve.

*options* none  
*returns* `Promise<BluetoothGATTEnableResult>`

### scan
`scan(options: BluetoothGATTScanOptions): Promise<BluetoothGATTScanResults>`  

Initiates a Bluetooth scan and returns a list of available devices to pair with.

Note: Filtering for specific service UUIDs does not work for Android at the moment.
For Web usage, in order to be able to interact with a peripheral's services, one has
to use filters when scanning.

*options* `BluetoothGATTScanOptions`  
*returns* `Promise<BluetoothGATTScanResults>`

### connect
`connect(options: BluetoothGATTConnectOptions): Promise<BluetoothGATTConnectResult>`  

Establish connection to a peripheral's GATTServer.

*options* `BluetoothGATTConnectOptions`  
*returns* `Promise<BluetoothGATTConnectResult>`

### disconnect
`disconnect(options: BluetoothGATTDisconnectOptions): Promise<BluetoothGATTDisconnectResult>`  

Disconnect from a peripheral's GATTServer.

*options* `BluetoothGATTDisconnectOptions`  
*returns* `Promise<BluetoothGATTDisconnectResult>`

### discover
`discover(options: BluetoothGATTServiceDiscoveryOptions): Promise<BluetoothGATTServiceDiscoveryResult>`  

Perform service discovery on a given Peripheral.

Note: This method does not need to be called in Browsers, since service
discovery takes place implicitly.

*options* `BluetoothGATTServiceDiscoveryOptions`  
*returns* `Promise<BluetoothGATTServiceDiscoveryResult>`

### read
`read(options: BluetoothGATTCharacteristicReadOptions): Promise<BluetoothGATTCharacteristicReadResult>`  

Read value of GATT-Characteristic.

*options* `BluetoothGATTCharacteristicReadOptions`  
*returns* `Promise<BluetoothGATTCharacteristicReadResult>`

### write
`write(options: BluetoothGATTCharacteristicWriteOptions): Promise<BluetoothGATTCharacteristicWriteResult>`  

Write value of GATT-Characteristic.

*options* `BluetoothGATTCharacteristicWriteOptions`  
*returns* `Promise<BluetoothGATTCharacteristicWriteResult>`

### readDescriptor
`readDescriptor(options: BluetoothGATTDescriptorReadOptions): Promise<BluetoothGATTDescriptorReadResult>`  

Read value of GATT-Descriptor.

*options* `BluetoothGATTDescriptorReadOptions`  
*returns* `Promise<BluetoothGATTDescriptorReadResult>`

### writeDescriptor
`writeDescriptor(options: BluetoothGATTDescriptorWriteOptions): Promise<BluetoothGATTDescriptorWriteResult>`  

Write value of GATT-Descriptor.

*options* `BluetoothGATTDescriptorWriteOptions`  
*returns* `Promise<BluetoothGATTDescriptorWriteResult>`

### enableNotifications
`enableNotifications(options: BluetoothGATTNotificationOptions): Promise<BluetoothGATTEnableNotificationsResult>`  

Be notified when the value of a GATT-Characteristic changes.
In order to retrieve the changed value, one has to use an Event Listener.
Thereby, the event name is the `string` representation of a GATT-Characteristic's Hexadecimal UUID.
``` typescript
const listener = BluetoothLEClient.addListener( eventName , (data) => {
    
    const {value} = data;
    //Do something with the data
    
});
```

*options* `BluetoothGATTNotificationOptions`  
*returns* `Promise<BluetoothGATTEnableNotificationsResult>`

### disableNotifications
`disableNotifications(options: BluetoothGATTNotificationOptions): Promise<BluetoothGATTDisableNotificationsResult>`  

Stops the propagation of value changes.

Additionally, the event listener has to be removed.

```typescript
listener.remove();
```

*options* `BluetoothGATTNotificationOptions`  
*returns* `Promise<BluetoothGATTDisableNotificationsResult>`

### getServices
`getServices(options: GetServiceOptions): Promise<GetServiceResult>`  

Retrieves a list of available GATT-Services for a given peripheral's GATT-Server.

*options* `GetServiceOptions`  
*returns* `Promise<GetServiceResult>`

### getService
`getService(options: GetServiceOptions): Promise<GetServiceResult>`  

Retrieves a single GATT-Service, specified by UUID.

*options* `GetServiceOptions`  
*returns* `Promise<GetServiceResult>`

### getCharacteristics
`getCharacteristics(options: GetCharacteristicOptions): Promise<GetCharacteristicResult>`  

Retrieves a list of available GATT-Characteristics for a given GATT-Service.

*options* `GetCharacteristicOptions`  
*returns* `Promise<GetCharacteristicResult>`

### getCharacteristic
`getCharacteristic(options: GetCharacteristicOptions): Promise<GetCharacteristicResult>`  

Retrieves a single GATT-Characteristic, specified by UUID.

*options* `GetCharacteristicOptions`  
*returns* `Promise<GetCharacteristicResult>`


