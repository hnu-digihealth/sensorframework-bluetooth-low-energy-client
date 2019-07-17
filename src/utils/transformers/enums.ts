export enum PulseRateRange{
    PULSE_RATE_WITHIN_RANGE = 0,
    PULSE_RATE_EXCEEDS_UPPER_LIMIT = 1,
    PULSE_RATE_LESS_THAN_LOWER_LIMIT = 2
}

export enum BodySensorLocation{
    OTHER = 0,
    CHEST = 1,
    WRIST = 2,
    FINGER = 3,
    HAND = 4,
    EAR_LOBE = 5,
    FOOT = 6
}

export enum GlucoseMeasurementSampleType{
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

export enum GlucoseMeasurementSampleLocation{
    FINGER = 1,
    AST = 2,
    EAR_LOBE = 3,
    CONTROL_SOLUTION = 4,
    LOCATION_NOT_AVAILABLE = 15
}

export enum CarbohydrateType{
    BREAKFAST = 1,
    LUNCH = 2,
    DINNER = 3,
    SNACK = 4,
    DRINK = 5,
    SUPPER = 6,
    BRUNCH = 7
}

export enum MealType{
    PREPRANDIAL = 1,
    POSTPRANDIAL = 2,
    FASTING = 3,
    CASUAL = 4,
    BEDTIME = 5
}

export enum TesterType{
    SELF = 1,
    HEALTH_CARE_PROFESSIONAL = 2,
    LAB_TEST = 3,
    TESTER_NOT_AVAILABLE = 15
}

export enum HealthType{
    MINOR_HEALTH_ISSUES = 1,
    MAJOR_HEALTH_ISSUES = 2,
    DURING_MENSES = 3,
    UNDER_STRESS = 4,
    NO_HEALTH_ISSUES = 5,
    HEALTH_NOT_AVAILABLE = 15
}

export enum MedicationType{
    RAPID_ACTING_INSULIN = 1,
    SHORT_ACTING_INSULIN = 2,
    INTERMEDIATE_ACTING_INSULIN = 3,
    LONG_ACTING_INSULIN = 4,
    PRE_MIXED_INSULIN = 5
}

export enum TemperatureType{
    ARMPIT = 1,
    BODY = 2,
    EAR_LOBE = 3,
    FINGER = 4,
    GASTRO_INTESTINAL_TRACT = 5,
    MOUTH = 6,
    RECTUM = 7,
    TOE = 8,
    TYMPANUM = 9
}
