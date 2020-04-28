package com.bleclient.plugin;

import android.Manifest;
import android.app.Instrumentation;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.os.ParcelUuid;
import android.preference.PreferenceManager;
import android.util.Base64;
import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@NativePlugin(
        permissions = {
                Manifest.permission.BLUETOOTH,
                Manifest.permission.BLUETOOTH_ADMIN,
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION
        },
        requestCodes = {
                BluetoothLEClient.REQUEST_ENABLE_BT
        }
)
public class BluetoothLEClient extends Plugin {

    static final int REQUEST_ENABLE_BT = 420;

    static final int SERVICES_UNDISCOVERED = 0;
    static final int SERVICES_DISCOVERING = 1;
    static final int SERVICES_DISCOVERED = 2;

    static final String BASE_UUID_HEAD = "0000";
    static final String BASE_UUID_TAIL = "-0000-1000-8000-00805F9B34FB";

    static final String keyDiscovered = "discoveredState";
    static final String keyPeripheral = "peripheral";
    static final String keyConnectionState = "connectionState";

    static final String keyEnabled = "enabled";
    static final String keyAvailable = "isAvailable";
    static final String keyAvailableDevices = "devices";
    static final String keyAddress = "id";
    static final String keyUuid = "uuid";
    static final String keyServices = "services";
    static final String keyService = "service";
    static final String keyAutoConnect = "autoConnect";
    static final String keyConnected = "connected";
    static final String keyDisconnected = "disconnected";
    static final String keyIncludedServices = "included";
    static final String keyCharacteristics = "characteristics";
    static final String keyCharacteristic = "characteristic";
    static final String keyDescriptor = "descriptor";
    static final String keyValue = "value";
    static final String keyDiscoveryState = "discovered";
    static final String keySuccess = "success";
    static final String keyDeviceType = "type";
    static final String keyBondState = "bondState";
    static final String keyDeviceName = "name";
    static final String keyCharacterisicDescripors = "descriptors";
    static final String keyCharacteristicProperies = "properties";
    static final String keyIsPrimaryService = "isPrimary";
    static final String keyPropertyAuthenticatedSignedWrites = "authenticatedSignedWrites";
    static final String keyPropertyBroadcast = "broadcast";
    static final String keyPropertyIndicate = "indicate";
    static final String keyPropertyNotify = "notify";
    static final String keyPropertyRead = "read";
    static final String keyPropertyWrite = "write";
    static final String keyPropertyWriteWithoutResponse = "writeWithoutResponse";

    static final String keyErrorAddressMissing = "Property id is required";
    static final String keyErrorServiceMissing = "Property service is required";
    static final String keyErrorCharacteristicMissing = "Property characteristic is required";
    static final String keyErrorDescriptorMissing = "Property descriptor is required";
    static final String keyErrorNotConnected = "Not connected to peripheral";
    static final String keyErrorServiceNotFound = "Service not found";
    static final String keyErrorCharacteristicNotFound = "Characteristic not found";
    static final String keyErrorDescriptorNotFound = "Descriptor not found";
    static final String keyErrorValueMissing = "Property value is required";
    static final String keyErrorValueSet = "Failed to set value";
    static final String keyErrorValueWrite = "Failed to write value";
    static final String keyErrorValueRead = "Failed to read value";


    static final String keyOperationConnect = "connectCallback";
    static final String keyOperationDisconnect = "disconnectCallback";
    static final String keyOperationDiscover = "discoverCallback";
    static final String keyOperationReadDescriptor = "readDescriptorCallback";
    static final String keyOperationWriteDescriptor = "writeDescriptorCallback";
    static final String keyOperationRead = "readCharacteristicCallback";
    static final String keyOperationWrite = "writeCharacteristicCallback";

    static final int clientCharacteristicConfigurationUuid = 0x2902;

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothLeScanner bleScanner;

    private ScanCallback scanCallback;
    private HashMap<String, BluetoothDevice> availableDevices = new HashMap<String, BluetoothDevice>();
    private HashMap<String, Object> connections = new HashMap<>();

    private BluetoothGattCallback bluetoothGattCallback = new BluetoothGattCallback() {
        @Override
        public void onPhyUpdate(BluetoothGatt gatt, int txPhy, int rxPhy, int status) {
            super.onPhyUpdate(gatt, txPhy, rxPhy, status);
        }

        @Override
        public void onPhyRead(BluetoothGatt gatt, int txPhy, int rxPhy, int status) {
            super.onPhyRead(gatt, txPhy, rxPhy, status);
        }

        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {

            BluetoothDevice device = gatt.getDevice();
            String address = device.getAddress();

            HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

            if (connection == null) {
                return;
            }

            if (status == BluetoothGatt.GATT_SUCCESS) {

                switch (newState) {

                    case BluetoothProfile.STATE_CONNECTING: {
                        connection.put(keyConnectionState, BluetoothProfile.STATE_CONNECTING);
                        break;
                    }
                    case BluetoothProfile.STATE_CONNECTED: {
                        connection.put(keyConnectionState, BluetoothProfile.STATE_CONNECTED);

                        PluginCall call = (PluginCall) connection.get(keyOperationConnect);

                        if (call == null) {
                            break;
                        }

                        JSObject ret = new JSObject();
                        addProperty(ret, keyConnected, true);
                        call.resolve(ret);
                        connection.remove(keyOperationConnect);
                        break;
                    }
                    case BluetoothProfile.STATE_DISCONNECTING: {
                        connection.put(keyConnectionState, BluetoothProfile.STATE_DISCONNECTING);
                        break;
                    }
                    case BluetoothProfile.STATE_DISCONNECTED: {
                        connection.put(keyConnectionState, BluetoothProfile.STATE_DISCONNECTED);

                        PluginCall call = (PluginCall) connection.get(keyOperationDisconnect);

                        if (call == null) {
                            break;
                        }

                        JSObject ret = new JSObject();
                        addProperty(ret, keyDisconnected, true);
                        call.resolve(ret);

                        connection.remove(keyOperationDisconnect);
                        connections.remove(address);
                        break;
                    }
                }

            } else {


                if (connection.get(keyOperationConnect) != null) {

                    PluginCall call = (PluginCall) connection.get(keyOperationConnect);

                    call.error("Unable to connect to Peripheral");
                    connection.remove(keyOperationConnect);
                    return;

                } else if (connection.get(keyOperationDisconnect) != null) {

                    PluginCall call = (PluginCall) connection.get(keyOperationDisconnect);

                    call.error("Unable to disconnect from Peripheral");
                    connection.remove(keyOperationDisconnect);

                    return;

                } else {

                    Log.e(getLogTag(), "GATT operation unsuccessfull");
                    return;

                }

            }
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {

            BluetoothDevice device = gatt.getDevice();
            String address = device.getAddress();

            HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

            PluginCall call = (PluginCall) connection.get(keyOperationDiscover);

            if (connection == null || call == null) {
                Log.e(getLogTag(), "No connection or saved call");
                return;
            }

            JSObject ret = new JSObject();

            if (status == BluetoothGatt.GATT_SUCCESS) {
                connection.put(keyDiscovered, SERVICES_DISCOVERED);
                addProperty(ret, keyDiscoveryState, true);
                call.resolve(ret);
            } else {
                call.error("Service discovery unsuccessful");
            }

            connection.remove(keyOperationDiscover);
        }

        @Override
        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {

            BluetoothDevice device = gatt.getDevice();
            String address = device.getAddress();

            HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

            if (connection == null) {
                Log.e(getLogTag(), "No connection found");
                return;
            }

            PluginCall call = (PluginCall) connection.get(keyOperationRead);
            connection.remove(keyOperationRead);

            if (call == null) {
                Log.e(getLogTag(), "No callback for operation found");
                return;
            }

            JSObject ret = new JSObject();

            if (status == BluetoothGatt.GATT_SUCCESS) {
                byte[] characteristicValue = characteristic.getValue();
                addProperty(ret, keyValue, jsByteArray(characteristicValue));
                call.resolve(ret);
            } else {
                call.error(keyErrorValueRead);
            }

        }

        @Override
        public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {

            BluetoothDevice device = gatt.getDevice();
            String address = device.getAddress();

            HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

            if (connection == null) {
                Log.e(getLogTag(), "No connection found");
                return;
            }

            PluginCall call = (PluginCall) connection.get(keyOperationWrite);
            connection.remove(keyOperationWrite);

            if (call == null) {
                Log.e(getLogTag(), "No callback for operation found");
                return;
            }

            if (status == BluetoothGatt.GATT_SUCCESS) {
                JSObject ret = new JSObject();
                byte[] value = characteristic.getValue();
                addProperty(ret, keyValue, jsByteArray(value));
            } else {
                call.error(keyErrorValueWrite);
            }
        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {

            BluetoothDevice device = gatt.getDevice();
            String address = device.getAddress();

            UUID characteristicUuid = characteristic.getUuid();

            BluetoothGattService service = characteristic.getService();
            UUID serviceUuid = service.getUuid();

            byte[] characteristicValue = characteristic.getValue();


            Integer characteristic16BitUuid = get16BitUUID(characteristicUuid);

            if (characteristic16BitUuid == null) {
                return;
            }

            JSObject ret = new JSObject();
            addProperty(ret, keyValue, jsByteArray(characteristicValue));

            notifyListeners(characteristic16BitUuid.toString(), ret);
        }

        @Override
        public void onDescriptorRead(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {

            BluetoothDevice device = gatt.getDevice();
            String address = device.getAddress();

            HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

            if (connection == null) {
                return;
            }

            PluginCall call = (PluginCall) connection.get(keyOperationReadDescriptor);

            if (call == null) {
                return;
            }

            if (status == BluetoothGatt.GATT_SUCCESS) {

                JSObject ret = new JSObject();

                byte[] value = descriptor.getValue();
                addProperty(ret, keyValue, jsByteArray(value));

                call.resolve(ret);
            } else {
                call.error(keyErrorValueRead);
            }

            connection.remove(keyOperationReadDescriptor);

        }

        @Override
        public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {

            BluetoothDevice device = gatt.getDevice();
            String address = device.getAddress();

            HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

            if (connection == null) {
                return;
            }

            PluginCall call = (PluginCall) connection.get(keyOperationWriteDescriptor);

            if (call == null) {
                return;
            }

            byte[] value = descriptor.getValue();

            JSObject ret = new JSObject();

            if (status == BluetoothGatt.GATT_SUCCESS) {

                addProperty(ret, keyValue, jsByteArray(value));
                call.resolve(ret);

            } else {
                call.error(keyErrorValueWrite);
            }

            connection.remove(keyOperationWriteDescriptor);

        }

        @Override
        public void onReliableWriteCompleted(BluetoothGatt gatt, int status) {
            super.onReliableWriteCompleted(gatt, status);
        }

        @Override
        public void onReadRemoteRssi(BluetoothGatt gatt, int rssi, int status) {
            super.onReadRemoteRssi(gatt, rssi, status);
        }

        @Override
        public void onMtuChanged(BluetoothGatt gatt, int mtu, int status) {
            super.onMtuChanged(gatt, mtu, status);
        }

    };

    private class BLEScanCallback extends ScanCallback {

        @Override
        public void onScanResult(int callbackType, ScanResult result) {
            super.onScanResult(callbackType, result);

            BluetoothDevice device = result.getDevice();

            if (!availableDevices.containsKey(device.getAddress())) {
                availableDevices.put(device.getAddress(), device);
            }

            return;

        }

        @Override
        public void onScanFailed(int errorCode) {
            Log.e(getLogTag(), "BLE scan failed with code " + errorCode);
            return;
        }
    }

    @Override
    protected void handleOnStart() {
        BluetoothManager bluetoothManager = (BluetoothManager) getContext().getSystemService(Context.BLUETOOTH_SERVICE);
        bluetoothAdapter = bluetoothManager.getAdapter();
    }

    @PluginMethod()
    public void isAvailable(PluginCall call) {

        JSObject ret = new JSObject();

        if (getContext().getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
            ret.put(keyAvailable, true);
            call.resolve(ret);
        } else {
            ret.put(keyAvailable, false);
            call.resolve(ret);
        }
    }

    @PluginMethod()
    public void isEnabled(PluginCall call) {

        JSObject ret = new JSObject();

        if (bluetoothAdapter.isEnabled()) {
            ret.put(keyEnabled, true);
            call.resolve(ret);
        } else {
            ret.put(keyEnabled, false);
            call.resolve(ret);
        }
    }

    @PluginMethod()
    public void enable(PluginCall call) {

        if (!bluetoothAdapter.isEnabled()) {
            Intent enableIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(call, enableIntent, REQUEST_ENABLE_BT);
        }
    }

    @PluginMethod()
    public void scan(PluginCall call) {

        bleScanner = bluetoothAdapter.getBluetoothLeScanner();
        availableDevices = new HashMap<String, BluetoothDevice>();

        scanCallback = new BLEScanCallback();

        ScanSettings settings = new ScanSettings.Builder()
                .setScanMode(ScanSettings.SCAN_MODE_LOW_POWER)
                .build();


        ArrayList<UUID> uuids = getServiceUuids(call.getArray(keyServices));

        List<ScanFilter> filters = new ArrayList<ScanFilter>();

        for (UUID uuid : uuids) {
            ScanFilter filter = new ScanFilter.Builder().setServiceUuid(new ParcelUuid(uuid)).build();
            filters.add(filter);
        }

        filters = new ArrayList<>();

        bleScanner.startScan(filters, settings, scanCallback);

        Handler handler = new Handler();
        handler.postDelayed(this::stopScan, 2000);
        saveCall(call);
    }

    @PluginMethod()
    public void connect(PluginCall call) {

        String address = call.getString(keyAddress);

        if (address == null) {
            call.reject(keyErrorAddressMissing);
            return;
        }

        HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

        if(connection != null){

            boolean isAlreadyConnected = (Integer) connection.get(keyConnectionState) == BluetoothProfile.STATE_CONNECTED;
            boolean servicesDiscovered = (Integer) connection.get(keyDiscovered) == SERVICES_DISCOVERED;

            if(isAlreadyConnected && servicesDiscovered ){
                JSObject ret = new JSObject();
                addProperty(ret, keyConnected, true);
                call.resolve(ret);
                return;
            }

            connections.remove(address);
        }

        BluetoothDevice bluetoothDevice = bluetoothAdapter.getRemoteDevice(address);

        if (bluetoothDevice == null) {
            call.reject("Device not found");
            return;
        }

        Boolean autoConnect = call.getBoolean(keyAutoConnect);
        autoConnect = autoConnect == null ? false : autoConnect;


        HashMap<String, Object> con = new HashMap<>();
        con.put(keyDiscovered, SERVICES_UNDISCOVERED);
        con.put(keyOperationConnect, call);

        BluetoothGatt gatt = bluetoothDevice.connectGatt(getContext(), autoConnect, bluetoothGattCallback);

        con.put(keyPeripheral, gatt);
        connections.put(address, con);

    }

    @PluginMethod()
    public void disconnect(PluginCall call) {

        String address = call.getString(keyAddress);

        if (address == null) {
            call.reject(keyErrorAddressMissing);
            return;
        }

        HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

        if (connection == null) {

            JSObject ret = new JSObject();
            addProperty(ret, keyDisconnected, true);
            call.resolve(ret);

            return;
        }

        connection.put(keyOperationDisconnect, call);

        BluetoothGatt gatt = (BluetoothGatt) connection.get(keyPeripheral);
        gatt.disconnect();

        return;

    }

    @PluginMethod()
    public void discover(PluginCall call) {

        String address = call.getString(keyAddress);

        if (address == null) {
            call.reject(keyErrorAddressMissing);
            return;
        }

        HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

        if (connection == null) {
            call.reject(keyErrorNotConnected);
            return;
        }

        BluetoothGatt gatt = (BluetoothGatt) connection.get(keyPeripheral);

        boolean discoveryStarted = gatt.discoverServices();

        if (discoveryStarted) {
            connection.put(keyDiscovered, SERVICES_DISCOVERING);
            connection.put(keyOperationDiscover, call);
        } else {
            call.reject("Failed to start service discovery");
        }

    }

    @PluginMethod()
    public void enableNotifications(PluginCall call) {

        String address = call.getString(keyAddress);

        if (address == null) {
            call.reject(keyErrorAddressMissing);
            return;
        }

        HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

        if (connection == null) {
            call.reject(keyErrorNotConnected);
            return;
        }

        BluetoothGatt gatt = (BluetoothGatt) connection.get(keyPeripheral);

        Integer propertyService = call.getInt(keyService);

        if (propertyService == null) {
            call.reject(keyErrorServiceMissing);
            return;
        }

        UUID serviceUuid = get128BitUUID(propertyService);

        BluetoothGattService service = gatt.getService(serviceUuid);

        if (service == null) {
            call.reject(keyErrorServiceNotFound);
            return;
        }

        Integer propertyCharacteristic = call.getInt(keyCharacteristic);

        if (propertyCharacteristic == null) {
            call.reject(keyErrorCharacteristicMissing);
            return;
        }

        UUID charactristicUuid = get128BitUUID(propertyCharacteristic);

        BluetoothGattCharacteristic characteristic = service.getCharacteristic(charactristicUuid);

        if (characteristic == null) {
            call.reject(keyErrorCharacteristicNotFound);
            return;
        }

        UUID clientCharacteristicConfDescriptorUuid = get128BitUUID(clientCharacteristicConfigurationUuid);
        BluetoothGattDescriptor notificationDescriptor = characteristic.getDescriptor(clientCharacteristicConfDescriptorUuid);

        if (notificationDescriptor == null) {
            call.reject(keyErrorDescriptorNotFound);
            return;
        }

        boolean notificationSet = gatt.setCharacteristicNotification(characteristic, true);

        if (!notificationSet) {
            call.reject("Unable to set characteristic notification");
            return;
        }

        boolean result = false;


        if ((characteristic.getProperties() & BluetoothGattCharacteristic.PROPERTY_NOTIFY) == BluetoothGattCharacteristic.PROPERTY_NOTIFY) {
            result = notificationDescriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
        } else {
            result = notificationDescriptor.setValue(BluetoothGattDescriptor.ENABLE_INDICATION_VALUE);
        }

        if (!result) {
            call.reject(keyErrorValueSet);
            return;
        }

        connection.put(keyOperationWriteDescriptor, call);

        result = gatt.writeDescriptor(notificationDescriptor);

        if (!result) {
            connection.remove(keyOperationWriteDescriptor);
            call.reject(keyErrorValueWrite);
            return;
        }


    }

    @PluginMethod()
    public void disableNotifications(PluginCall call) {

        String address = call.getString(keyAddress);

        if (address == null) {
            call.reject(keyErrorAddressMissing);
            return;
        }

        HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

        if (connection == null) {
            call.reject(keyErrorNotConnected);
            return;
        }

        BluetoothGatt gatt = (BluetoothGatt) connection.get(keyPeripheral);

        Integer propertyService = call.getInt(keyService);

        if (propertyService == null) {
            call.reject(keyErrorServiceMissing);
            return;
        }

        UUID serviceUuid = get128BitUUID(propertyService);

        BluetoothGattService service = gatt.getService(serviceUuid);

        if (service == null) {
            call.reject(keyErrorServiceNotFound);
            return;
        }

        Integer propertyCharacteristic = call.getInt(keyCharacteristic);

        if (propertyCharacteristic == null) {
            call.reject(keyErrorCharacteristicMissing);
            return;
        }

        UUID charactristicUuid = get128BitUUID(propertyCharacteristic);

        BluetoothGattCharacteristic characteristic = service.getCharacteristic(charactristicUuid);

        if (characteristic == null) {
            call.reject(keyErrorCharacteristicNotFound);
            return;
        }

        UUID clientCharacteristicConfDescriptorUuid = get128BitUUID(clientCharacteristicConfigurationUuid);
        BluetoothGattDescriptor notificationDescriptor = characteristic.getDescriptor(clientCharacteristicConfDescriptorUuid);

        if (notificationDescriptor == null) {
            call.reject(keyErrorDescriptorNotFound);
            return;
        }

        boolean notificationUnset = gatt.setCharacteristicNotification(characteristic, false);

        if (!notificationUnset) {
            call.reject("Unable to unset characteristic notification");
            return;
        }

        boolean result = notificationDescriptor.setValue(BluetoothGattDescriptor.DISABLE_NOTIFICATION_VALUE);

        if (!result) {
            call.reject(keyErrorValueSet);
            return;
        }

        connection.put(keyOperationWriteDescriptor, call);

        result = gatt.writeDescriptor(notificationDescriptor);

        if (!result) {
            connection.remove(keyOperationWriteDescriptor);
            call.reject(keyErrorValueWrite);
            return;
        }
    }

    @PluginMethod()
    public void read(PluginCall call) {

        String address = call.getString(keyAddress);

        if (address == null) {
            call.reject(keyErrorAddressMissing);
            return;
        }

        HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

        if (connection == null) {
            call.reject(keyErrorNotConnected);
            return;
        }

        BluetoothGatt gatt = (BluetoothGatt) connection.get(keyPeripheral);

        Integer propertyCharacteristic = call.getInt(keyCharacteristic);

        if (propertyCharacteristic == null) {
            call.reject(keyErrorCharacteristicMissing);
            return;
        }

        Integer propertyService = call.getInt(keyService);

        if (propertyService == null) {
            call.reject(keyErrorServiceMissing);
            return;
        }


        UUID service128BitUuid = get128BitUUID(propertyService);
        BluetoothGattService service = gatt.getService(service128BitUuid);

        if (service == null) {
            call.reject(keyErrorServiceNotFound);
            return;
        }

        UUID characteristic128BitUuid = get128BitUUID(propertyCharacteristic);
        BluetoothGattCharacteristic characteristic = service.getCharacteristic(characteristic128BitUuid);

        if (characteristic == null) {
            call.reject(keyErrorCharacteristicNotFound);
            return;
        }

        connection.put(keyOperationRead, call);


        boolean success = gatt.readCharacteristic(characteristic);

        if (!success) {
            call.error(keyErrorValueRead);
            connection.remove(keyOperationRead);
        }


    }

    @PluginMethod()
    public void write(PluginCall call) {

        String address = call.getString(keyAddress);

        if (address == null) {
            call.reject(keyErrorAddressMissing);
            return;
        }

        HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

        if (connection == null) {
            call.reject(keyErrorNotConnected);
            return;
        }

        BluetoothGatt gatt = (BluetoothGatt) connection.get(keyPeripheral);

        Integer propertyCharacteristic = call.getInt(keyCharacteristic);

        if (propertyCharacteristic == null) {
            call.reject(keyErrorCharacteristicMissing);
            return;
        }

        Integer propertyService = call.getInt(keyService);

        if (propertyService == null) {
            call.reject(keyErrorServiceMissing);
            return;
        }

        UUID service128BitUuid = get128BitUUID(propertyCharacteristic);
        BluetoothGattService service = gatt.getService(service128BitUuid);

        if (service == null) {
            call.reject(keyErrorServiceNotFound);
            return;
        }

        UUID characteristic128BitUuid = get128BitUUID(propertyCharacteristic);
        BluetoothGattCharacteristic characteristic = service.getCharacteristic(characteristic128BitUuid);

        if (characteristic == null) {
            call.reject(keyErrorCharacteristicNotFound);
            return;
        }

        String value = call.getString(keyValue);

        if (value == null) {
            call.reject(keyErrorValueMissing);
            return;
        }

        byte[] toWrite = toByteArray(value);

        if (toWrite == null) {
            call.reject("Unsufficient value given");
            return;
        }

        boolean valueSet = characteristic.setValue(toWrite);

        if (!valueSet) {
            call.reject(keyErrorValueSet);
            return;
        }

        connection.put(keyOperationWrite, call);

        boolean success = gatt.writeCharacteristic(characteristic);

        if (!success) {
            call.error(keyErrorValueWrite);
            connection.remove(keyOperationWrite);
        }

    }

    @PluginMethod()
    public void readDescriptor(PluginCall call) {

        String address = call.getString(keyAddress);

        if (address == null) {
            call.reject(keyErrorAddressMissing);
            return;
        }

        HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

        if (connection == null) {
            call.reject(keyErrorNotConnected);
            return;
        }

        BluetoothGatt gatt = (BluetoothGatt) connection.get(keyPeripheral);

        Integer propertyService = call.getInt(keyService);

        if (propertyService == null) {
            call.reject(keyErrorServiceMissing);
            return;
        }

        Integer propertyCharacteristic = call.getInt(keyCharacteristic);

        if (propertyCharacteristic == null) {
            call.reject(keyErrorCharacteristicMissing);
            return;
        }

        Integer propertyDescriptor = call.getInt(keyDescriptor);

        if (propertyDescriptor == null) {
            call.reject(keyErrorDescriptorMissing);
            return;
        }

        BluetoothGattService service = gatt.getService(get128BitUUID(propertyService));

        if (service == null) {
            call.reject(keyErrorServiceNotFound);
            return;
        }

        BluetoothGattCharacteristic characteristic = service.getCharacteristic(get128BitUUID(propertyCharacteristic));

        if (characteristic == null) {
            call.reject(keyErrorCharacteristicNotFound);
            return;
        }

        BluetoothGattDescriptor descriptor = characteristic.getDescriptor(get128BitUUID(propertyDescriptor));

        if (descriptor == null) {
            call.reject(keyErrorDescriptorNotFound);
            return;
        }

        connection.put(keyOperationReadDescriptor, call);

        boolean success = gatt.readDescriptor(descriptor);

        if (!success) {
            connection.remove(keyOperationReadDescriptor);
            call.reject(keyErrorValueRead);
            return;
        }


    }

    @PluginMethod()
    public void getServices(PluginCall call) {

        String address = call.getString(keyAddress);

        if (address == null) {
            call.reject(keyErrorAddressMissing);
            return;
        }

        HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

        if (connection == null) {
            call.reject(keyErrorNotConnected);
            return;
        }

        BluetoothGatt gatt = (BluetoothGatt) connection.get(keyPeripheral);

        List<BluetoothGattService> services = gatt.getServices();
        ArrayList<JSObject> retServices = new ArrayList<>();

        for (BluetoothGattService service : services) {
            retServices.add(createJSBluetoothGattService(service));
        }

        JSObject ret = new JSObject();
        addProperty(ret, keyServices, JSArray.from(retServices.toArray()));

        call.resolve(ret);

    }

    @PluginMethod()
    public void getSetvice(PluginCall call) {

        String address = call.getString(keyAddress);

        if (address == null) {
            call.reject(keyErrorAddressMissing);
            return;
        }

        HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

        if (connection == null) {
            call.reject(keyErrorNotConnected);
            return;
        }

        BluetoothGatt peripheral = (BluetoothGatt) connection.get(keyPeripheral);

        Integer propertyService = call.getInt(keyUuid);

        if (propertyService == null) {
            call.reject(keyErrorServiceMissing);
            return;
        }

        BluetoothGattService service = peripheral.getService(get128BitUUID(propertyService));

        if (service == null) {
            call.reject(keyErrorServiceNotFound);
            return;
        }

        call.resolve(createJSBluetoothGattService(service));
    }

    @PluginMethod()
    public void getCharacteristics(PluginCall call) {

        String address = call.getString(keyAddress);

        if (address == null) {
            call.reject(keyErrorAddressMissing);
            return;
        }

        HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

        if (connection == null) {
            call.reject(keyErrorNotConnected);
            return;
        }

        BluetoothGatt gatt = (BluetoothGatt) connection.get(keyPeripheral);

        Integer propertyService = call.getInt(keyService);

        if (propertyService == null) {
            call.reject(keyErrorServiceMissing);
            return;
        }

        BluetoothGattService service = gatt.getService(get128BitUUID(propertyService));

        if (service == null) {
            call.reject(keyErrorServiceNotFound);
            return;
        }

        List<BluetoothGattCharacteristic> characteristics = service.getCharacteristics();

        ArrayList<JSObject> retCharacteristics = new ArrayList<>();

        for (BluetoothGattCharacteristic characteristic : characteristics) {
            retCharacteristics.add(createJSBluetoothGattCharacteristic(characteristic));
        }

        JSObject ret = new JSObject();
        addProperty(ret, keyCharacteristics, JSArray.from(retCharacteristics.toArray()));

        call.resolve(ret);
    }

    @PluginMethod()
    public void getCharacteristic(PluginCall call) {

        String address = call.getString(keyAddress);

        if (address == null) {
            call.reject(keyErrorAddressMissing);
            return;
        }

        HashMap<String, Object> connection = (HashMap<String, Object>) connections.get(address);

        if (connection == null) {
            call.reject(keyErrorNotConnected);
            return;
        }

        BluetoothGatt gatt = (BluetoothGatt) connection.get(keyPeripheral);

        Integer propertyService = call.getInt(keyService);

        if (propertyService == null) {
            call.reject(keyErrorServiceMissing);
            return;
        }

        BluetoothGattService service = gatt.getService(get128BitUUID(propertyService));

        if (service == null) {
            call.reject(keyErrorServiceNotFound);
            return;
        }

        Integer propertyCharacteristic = call.getInt(keyCharacteristic);

        if (propertyCharacteristic == null) {
            call.reject(keyErrorCharacteristicMissing);
            return;
        }

        BluetoothGattCharacteristic characteristic = service.getCharacteristic(get128BitUUID(propertyCharacteristic));

        if (characteristic == null) {
            call.reject(keyErrorCharacteristicNotFound);
            return;
        }

        JSObject retCharacteristic = createJSBluetoothGattCharacteristic(characteristic);

        call.resolve(retCharacteristic);

    }


    private void stopScan() {

        if (bleScanner == null) {
            bleScanner = bluetoothAdapter.getBluetoothLeScanner();
        }

        bleScanner.flushPendingScanResults(scanCallback);
        bleScanner.stopScan(scanCallback);

        JSObject ret = new JSObject();
        ret.put(keyAvailableDevices, getScanResult());

        PluginCall savedCall = getSavedCall();
        savedCall.resolve(ret);
        savedCall.release(getBridge());
        return;

    }

    private JSObject createBLEDeviceResult(BluetoothDevice device) {

        JSObject ret = new JSObject();

        addProperty(ret, keyDeviceName, device.getName());
        addProperty(ret, keyAddress, device.getAddress());
        addProperty(ret, keyBondState, device.getBondState());
        addProperty(ret, keyDeviceType, device.getType());

        return ret;
    }

    private JSObject createJSBluetoothGattService(BluetoothGattService service) {
        JSObject retService = new JSObject();

        addProperty(retService, keyUuid, get16BitUUID(service.getUuid()));

        if (service.getType() == BluetoothGattService.SERVICE_TYPE_PRIMARY) {
            addProperty(retService, keyIsPrimaryService, true);
        } else {
            addProperty(retService, keyIsPrimaryService, false);
        }


        ArrayList<Integer> included = new ArrayList<>();
        List<BluetoothGattService> subServices = service.getIncludedServices();

        for (BluetoothGattService incService : subServices) {
            included.add(get16BitUUID(incService.getUuid()));
        }

        retService.put(keyIncludedServices, JSArray.from(included.toArray()));

        ArrayList<Integer> retCharacteristics = new ArrayList<>();
        List<BluetoothGattCharacteristic> characteristics = service.getCharacteristics();

        for (BluetoothGattCharacteristic characteristic : characteristics) {
            retCharacteristics.add(get16BitUUID(characteristic.getUuid()));
        }

        retService.put(keyCharacteristics, JSArray.from(retCharacteristics.toArray()));

        return retService;
    }

    private JSObject createJSBluetoothGattCharacteristic(BluetoothGattCharacteristic characteristic) {

        JSObject retCharacteristic = new JSObject();

        addProperty(retCharacteristic, keyUuid, get16BitUUID(characteristic.getUuid()));
        addProperty(retCharacteristic, keyCharacteristicProperies, getCharacteristicProperties(characteristic));

        List<BluetoothGattDescriptor> descriptors = characteristic.getDescriptors();
        ArrayList<Integer> descriptorUuids = new ArrayList<>();

        for (BluetoothGattDescriptor descriptor : descriptors) {
            descriptorUuids.add(get16BitUUID(descriptor.getUuid()));
        }

        addProperty(retCharacteristic, keyCharacterisicDescripors, JSArray.from(descriptorUuids.toArray()));

        return retCharacteristic;

    }

    private JSObject getCharacteristicProperties(BluetoothGattCharacteristic characteristic) {

        JSObject properties = new JSObject();

        if ((characteristic.getProperties() & BluetoothGattCharacteristic.PROPERTY_SIGNED_WRITE) != 0) {
            addProperty(properties, keyPropertyAuthenticatedSignedWrites, true);
        } else {
            addProperty(properties, keyPropertyAuthenticatedSignedWrites, false);
        }

        if ((characteristic.getProperties() & BluetoothGattCharacteristic.PROPERTY_BROADCAST) != 0) {
            addProperty(properties, keyPropertyBroadcast, true);
        } else {
            addProperty(properties, keyPropertyBroadcast, false);
        }

        if ((characteristic.getProperties() & BluetoothGattCharacteristic.PROPERTY_INDICATE) != 0) {
            addProperty(properties, keyPropertyIndicate, true);
        } else {
            addProperty(properties, keyPropertyIndicate, false);
        }

        if ((characteristic.getProperties() & BluetoothGattCharacteristic.PROPERTY_NOTIFY) != 0) {
            addProperty(properties, keyPropertyNotify, true);
        } else {
            addProperty(properties, keyPropertyNotify, false);
        }

        if ((characteristic.getProperties() & BluetoothGattCharacteristic.PROPERTY_READ) != 0) {
            addProperty(properties, keyPropertyRead, true);
        } else {
            addProperty(properties, keyPropertyRead, false);
        }

        if ((characteristic.getProperties() & BluetoothGattCharacteristic.PROPERTY_WRITE) != 0) {
            addProperty(properties, keyPropertyWrite, true);
        } else {
            addProperty(properties, keyPropertyWrite, false);
        }

        if ((characteristic.getProperties() & BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE) != 0) {
            addProperty(properties, keyPropertyWriteWithoutResponse, true);
        } else {
            addProperty(properties, keyPropertyWriteWithoutResponse, false);
        }

        return properties;

    }

    private JSArray getScanResult() {

        ArrayList<JSObject> scanResults = new ArrayList<>();

        for (Map.Entry<String, BluetoothDevice> entry : availableDevices.entrySet()) {

            BluetoothDevice device = entry.getValue();
            scanResults.add(createBLEDeviceResult(device));
        }

        return JSArray.from(scanResults.toArray());

    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);

        Log.i(getLogTag(), "Handler called with " + resultCode);

        if (requestCode == REQUEST_ENABLE_BT) {
            PluginCall call = getSavedCall();

            if (call == null) {
                return;
            }

            JSObject ret = new JSObject();
            addProperty(ret, keyEnabled, resultCode == 0 ? false : true);
            call.resolve(ret);
            call.release(getBridge());
        }

    }

    private JSArray jsByteArray(byte[] bytes) {
        int[] ints = new int[bytes.length];

        for (int i=0; i<bytes.length; i++) {
            ints[i] = bytes[i] & 0xff;
        }

        return JSArray.from(ints);
    }


        ArrayList<UUID> serviceUuids = new ArrayList<>();
    private List<UUID> getServiceUuids(JSArray serviceUuidArray) {

        if (serviceUuidArray == null) {
            return serviceUuids;
        }

        List<Integer> uuidList;

        try {
            uuidList = serviceUuidArray.toList();
        } catch (JSONException e) {
            Log.e(getLogTag(), "Error while converting JSArray to List");
            return serviceUuids;
        }

        if (!(uuidList.size() > 0)) {
            Log.i(getLogTag(), "No uuids given");
            return serviceUuids;
        }

        for (Integer uuid : uuidList) {

            UUID uuid128 = get128BitUUID(uuid);

            if (uuid128 != null) {
                serviceUuids.add(uuid128);
            }
        }

        return serviceUuids;
    }

    private byte[] toByteArray(String base64Value) {
        if (base64Value == null) {
            return null;
        }

        byte[] bytes = Base64.decode(base64Value, Base64.NO_WRAP);

        if (bytes == null || bytes.length == 0) {
            return null;
        }

        return bytes;
    }

    private byte[] toByteArray(JSArray arrayValue) {
        if (arrayValue == null) {
            return null;
        }

        byte[] bytes = new byte[arrayValue.length()];

        for (int i=0; i<bytes.length; i++) {
            try {
                bytes[i] = (byte) arrayValue.get(i);
            } catch (JSONException e) {
                bytes[i] = 0;
            }
        }

        return bytes;
    }

    private UUID get128BitUUID(Integer uuid) {

        if (uuid == null) {
            return null;
        }

        String hexString = Integer.toHexString(uuid);

        if (hexString.length() != 4) {
            return null;
        }

        String uuidString = BASE_UUID_HEAD + hexString + BASE_UUID_TAIL;
        return UUID.fromString(uuidString);


    }

    private int get16BitUUID(UUID uuid) {
        String uuidString = uuid.toString();
        int hexUuid = Integer.parseInt(uuidString.substring(4, 8), 16);
        return hexUuid;
    }

    private void addProperty(JSObject obj, String key, Object value) {

        if (value == null) {
            obj.put(key, JSObject.NULL);
            return;
        }

        obj.put(key, value);

    }
}
