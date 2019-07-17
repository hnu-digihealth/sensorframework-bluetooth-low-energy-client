import {BluetoothGATTCharacteristics} from "./ble-gatt-characteristics.enum";
import {BatteryLevelCallback} from "./transformers/battery-level";
import {BodySensorLocationCallback} from "./transformers/body-sensor-location";
import {HeartRateMeasurementCallback} from "./transformers/heart-rate-measurement";
import {CurrentTimeCallback} from "./transformers/current-time";
import {BloodPressureMeasurementCallback} from "./transformers/blood-pressure-measurement";
import {BloodPressureFeatureCallback} from "./transformers/blood-pressure-feature";
import {BodyCompositionMeasurementCallback} from "./transformers/body-composition-measurement";
import {BodyCompositionFeatureCallback} from "./transformers/body-composition-feature";
import {PLXFeaturesCallback} from "./transformers/plx-features";
import {PLXSpotCheckMeasurementCallback} from "./transformers/plx-spot-check-measurement";
import {PLXContinuousMeasurementCallback} from "./transformers/plx-continuous-measurement";
import {BluetoothGATTCallbacks} from "../definitions";
import {GlucoseMeasurementCallback} from "./transformers/glucose-measurement";
import {GlucoseMeasurementContextCallback} from "./transformers/glucose-measurement-context";
import {GlucoseFeatureCallback} from "./transformers/glucose-feature";
import {TemperatureMeasurementCallback} from "./transformers/temperature-measurement";
import {TemperatureTypeCallback} from "./transformers/temperature-type";
import {WeightScaleFeatureCallback} from "./transformers/weight-scale-feature";
import {WeightMeasurementCallback} from "./transformers/weight-measurement";


export const Callbacks: BluetoothGATTCallbacks = {
    [BluetoothGATTCharacteristics.BATTERY_LEVEL]: BatteryLevelCallback,
    [BluetoothGATTCharacteristics.BODY_SENSOR_LOCATION]: BodySensorLocationCallback,
    [BluetoothGATTCharacteristics.HEART_RATE_MEASUREMENT]: HeartRateMeasurementCallback,
    [BluetoothGATTCharacteristics.CURRENT_TIME]: CurrentTimeCallback,
    [BluetoothGATTCharacteristics.BLOOD_PRESSURE_MEASUREMENT]: BloodPressureMeasurementCallback,
    [BluetoothGATTCharacteristics.BLOOD_PRESSURE_FEATURE]: BloodPressureFeatureCallback,
    [BluetoothGATTCharacteristics.BODY_COMPOSITION_MEASUREMENT]: BodyCompositionMeasurementCallback,
    [BluetoothGATTCharacteristics.BODY_COMPOSITION_FEATURE]: BodyCompositionFeatureCallback,
    [BluetoothGATTCharacteristics.PLX_FEATURES]: PLXFeaturesCallback,
    [BluetoothGATTCharacteristics.PLX_SPOT_CHECK_MEASUREMENT]: PLXSpotCheckMeasurementCallback,
    [BluetoothGATTCharacteristics.PLX_CONTINUOUS_MEASUREMENT]: PLXContinuousMeasurementCallback,
    [BluetoothGATTCharacteristics.GLUCOSE_MEASUREMENT]: GlucoseMeasurementCallback,
    [BluetoothGATTCharacteristics.GLUCOSE_MEASUREMENT_CONTEXT]: GlucoseMeasurementContextCallback,
    [BluetoothGATTCharacteristics.GLUCOSE_FEATURE]: GlucoseFeatureCallback,
    [BluetoothGATTCharacteristics.TEMPERATURE_MEASUREMENT]: TemperatureMeasurementCallback,
    [BluetoothGATTCharacteristics.TEMPERATURE_TYPE]: TemperatureTypeCallback,
    [BluetoothGATTCharacteristics.INTERMEDIATE_TEMPERATURE]: TemperatureMeasurementCallback,
    [BluetoothGATTCharacteristics.WEIGHT_SCALE_FEATURE]: WeightScaleFeatureCallback,
    [BluetoothGATTCharacteristics.WEIGHT_MEASUREMENT]: WeightMeasurementCallback
};


