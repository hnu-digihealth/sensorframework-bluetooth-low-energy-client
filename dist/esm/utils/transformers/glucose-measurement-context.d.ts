import { BluetoothGATTCallback } from "../../definitions";
export declare const GlucoseMeasurementContextCallback: BluetoothGATTCallback;
export declare enum CarbohydrateType {
    BREAKFAST = 1,
    LUNCH = 2,
    DINNER = 3,
    SNACK = 4,
    DRINK = 5,
    SUPPER = 6,
    BRUNCH = 7
}
export declare enum MealType {
    PREPRANDIAL = 1,
    POSTPRANDIAL = 2,
    FASTING = 3,
    CASUAL = 4,
    BEDTIME = 5
}
export declare enum TesterType {
    SELF = 1,
    HEALTH_CARE_PROFESSIONAL = 2,
    LAB_TEST = 3,
    TESTER_NOT_AVAILABLE = 15
}
export declare enum HealthType {
    MINOR_HEALTH_ISSUES = 1,
    MAJOR_HEALTH_ISSUES = 2,
    DURING_MENSES = 3,
    UNDER_STRESS = 4,
    NO_HEALTH_ISSUES = 5,
    HEALTH_NOT_AVAILABLE = 15
}
export declare enum MedicationType {
    RAPID_ACTING_INSULIN = 1,
    SHORT_ACTING_INSULIN = 2,
    INTERMEDIATE_ACTING_INSULIN = 3,
    LONG_ACTING_INSULIN = 4,
    PRE_MIXED_INSULIN = 5
}
