import { BluetoothGATTCallback } from "../../definitions";
export declare const BloodPressureMeasurementCallback: BluetoothGATTCallback;
export declare enum PulseRateRange {
    PULSE_RATE_WITHIN_RANGE = 0,
    PULSE_RATE_EXCEEDS_UPPER_LIMIT = 1,
    PULSE_RATE_LESS_THAN_LOWER_LIMIT = 2
}
