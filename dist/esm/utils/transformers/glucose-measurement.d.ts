import { BluetoothGATTCallback } from "../../definitions";
export declare const GlucoseMeasurementCallback: BluetoothGATTCallback;
export declare enum GlucoseMeasurementSampleType {
    CAPILLARY_WHOLE_BLOOD = 1,
    CAPILLARY_PLASMA = 2,
    VENOUS_WHOLE_BLOOD = 3,
    VENOUS_PLASMA = 4,
    ARTERIAL_WHOLE_BLOOD = 5,
    ARTERIAL_PLASMA = 6,
    UNDETERMINED_WHOLE_BLOOD = 7,
    UNDETERMINED_PLASMA = 8,
    ISF = 9,
    CONTROL_SOLUTION = 10
}
export declare enum GlucoseMeasurementSampleLocation {
    FINGER = 1,
    AST = 2,
    EAR_LOBE = 3,
    CONTROL_SOLUTION = 4,
    LOCATION_NOT_AVAILABLE = 15
}
