import { BluetoothGattCharacteristics } from "./ble-gatt-characteristics.enum";
import { BatteryLevelCallback } from "./transformers/battery-level";
import { BodySensorLocationCallback } from "./transformers/body-sensor-location";
import { HeartRateMeasurementCallback } from "./transformers/heart-rate-measurement";
import { CurrentTimeCallback } from "./transformers/current-time";
import { BloodPressureMeasurementCallback } from "./transformers/blood-pressure-measurement";
import { BloodPressureFeatureCallback } from "./transformers/blood-pressure-feature";
import { BodyCompositionMeasurementCallback } from "./transformers/body-composition-measurement";
import { BodyCompositionFeatureCallback } from "./transformers/body-composition-feature";
import { PLXFeaturesCallback } from "./transformers/plx-features";
import { PLXSpotCheckMeasurementCallback } from "./transformers/plx-spot-check-measurement";
import { PLXContinuousMeasurementCallback } from "./transformers/plx-continuous-measurement";
import { GlucoseMeasurementCallback } from "./transformers/glucose-measurement";
import { GlucoseMeasurementContextCallback } from "./transformers/glucose-measurement-context";
import { GlucoseFeatureCallback } from "./transformers/glucose-feature";
import { TemperatureMeasurementCallback } from "./transformers/temperature-measurement";
import { TemperatureTypeCallback } from "./transformers/temperature-type";
import { WeightScaleFeatureCallback } from "./transformers/weight-scale-feature";
import { WeightMeasurementCallback } from "./transformers/weight-measurement";
export const Callbacks = {
    [BluetoothGattCharacteristics.BATTERY_LEVEL]: BatteryLevelCallback,
    [BluetoothGattCharacteristics.BODY_SENSOR_LOCATION]: BodySensorLocationCallback,
    [BluetoothGattCharacteristics.HEART_RATE_MEASUREMENT]: HeartRateMeasurementCallback,
    [BluetoothGattCharacteristics.CURRENT_TIME]: CurrentTimeCallback,
    [BluetoothGattCharacteristics.BLOOD_PRESSURE_MEASUREMENT]: BloodPressureMeasurementCallback,
    [BluetoothGattCharacteristics.BLOOD_PRESSURE_FEATURE]: BloodPressureFeatureCallback,
    [BluetoothGattCharacteristics.BODY_COMPOSITION_MEASUREMENT]: BodyCompositionMeasurementCallback,
    [BluetoothGattCharacteristics.BODY_COMPOSITION_FEATURE]: BodyCompositionFeatureCallback,
    [BluetoothGattCharacteristics.PLX_FEATURES]: PLXFeaturesCallback,
    [BluetoothGattCharacteristics.PLX_SPOT_CHECK_MEASUREMENT]: PLXSpotCheckMeasurementCallback,
    [BluetoothGattCharacteristics.PLX_CONTINUOUS_MEASUREMENT]: PLXContinuousMeasurementCallback,
    [BluetoothGattCharacteristics.GLUCOSE_MEASUREMENT]: GlucoseMeasurementCallback,
    [BluetoothGattCharacteristics.GLUCOSE_MEASUREMENT_CONTEXT]: GlucoseMeasurementContextCallback,
    [BluetoothGattCharacteristics.GLUCOSE_FEATURE]: GlucoseFeatureCallback,
    [BluetoothGattCharacteristics.TEMPERATURE_MEASUREMENT]: TemperatureMeasurementCallback,
    [BluetoothGattCharacteristics.TEMPERATURE_TYPE]: TemperatureTypeCallback,
    [BluetoothGattCharacteristics.INTERMEDIATE_TEMPERATURE]: TemperatureMeasurementCallback,
    [BluetoothGattCharacteristics.WEIGHT_SCALE_FEATURE]: WeightScaleFeatureCallback,
    [BluetoothGattCharacteristics.WEIGHT_MEASUREMENT]: WeightMeasurementCallback
};
//# sourceMappingURL=ble-gatt-notification-callbacks.js.map