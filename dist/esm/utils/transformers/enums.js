export var PulseRateRange;
(function (PulseRateRange) {
    PulseRateRange[PulseRateRange["PULSE_RATE_WITHIN_RANGE"] = 0] = "PULSE_RATE_WITHIN_RANGE";
    PulseRateRange[PulseRateRange["PULSE_RATE_EXCEEDS_UPPER_LIMIT"] = 1] = "PULSE_RATE_EXCEEDS_UPPER_LIMIT";
    PulseRateRange[PulseRateRange["PULSE_RATE_LESS_THAN_LOWER_LIMIT"] = 2] = "PULSE_RATE_LESS_THAN_LOWER_LIMIT";
})(PulseRateRange || (PulseRateRange = {}));
export var BodySensorLocation;
(function (BodySensorLocation) {
    BodySensorLocation[BodySensorLocation["OTHER"] = 0] = "OTHER";
    BodySensorLocation[BodySensorLocation["CHEST"] = 1] = "CHEST";
    BodySensorLocation[BodySensorLocation["WRIST"] = 2] = "WRIST";
    BodySensorLocation[BodySensorLocation["FINGER"] = 3] = "FINGER";
    BodySensorLocation[BodySensorLocation["HAND"] = 4] = "HAND";
    BodySensorLocation[BodySensorLocation["EAR_LOBE"] = 5] = "EAR_LOBE";
    BodySensorLocation[BodySensorLocation["FOOT"] = 6] = "FOOT";
})(BodySensorLocation || (BodySensorLocation = {}));
export var GlucoseMeasurementSampleType;
(function (GlucoseMeasurementSampleType) {
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["CAPILLARY_WHOLE_BLOOD"] = 1] = "CAPILLARY_WHOLE_BLOOD";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["CAPILLARY_PLASMA"] = 2] = "CAPILLARY_PLASMA";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["VENOUS_WHOLE_BLOOD"] = 3] = "VENOUS_WHOLE_BLOOD";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["VENOUS_PLASMA"] = 4] = "VENOUS_PLASMA";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["ARTERIAL_WHOLE_BLOOD"] = 5] = "ARTERIAL_WHOLE_BLOOD";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["ARTERIAL_PLASMA"] = 6] = "ARTERIAL_PLASMA";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["UNDETERMINED_WHOLE_BLOOD"] = 7] = "UNDETERMINED_WHOLE_BLOOD";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["UNDETERMINED_PLASMA"] = 8] = "UNDETERMINED_PLASMA";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["ISF"] = 9] = "ISF";
    GlucoseMeasurementSampleType[GlucoseMeasurementSampleType["CONTROL_SOLUTION"] = 10] = "CONTROL_SOLUTION";
})(GlucoseMeasurementSampleType || (GlucoseMeasurementSampleType = {}));
export var GlucoseMeasurementSampleLocation;
(function (GlucoseMeasurementSampleLocation) {
    GlucoseMeasurementSampleLocation[GlucoseMeasurementSampleLocation["FINGER"] = 1] = "FINGER";
    GlucoseMeasurementSampleLocation[GlucoseMeasurementSampleLocation["AST"] = 2] = "AST";
    GlucoseMeasurementSampleLocation[GlucoseMeasurementSampleLocation["EAR_LOBE"] = 3] = "EAR_LOBE";
    GlucoseMeasurementSampleLocation[GlucoseMeasurementSampleLocation["CONTROL_SOLUTION"] = 4] = "CONTROL_SOLUTION";
    GlucoseMeasurementSampleLocation[GlucoseMeasurementSampleLocation["LOCATION_NOT_AVAILABLE"] = 15] = "LOCATION_NOT_AVAILABLE";
})(GlucoseMeasurementSampleLocation || (GlucoseMeasurementSampleLocation = {}));
export var CarbohydrateType;
(function (CarbohydrateType) {
    CarbohydrateType[CarbohydrateType["BREAKFAST"] = 1] = "BREAKFAST";
    CarbohydrateType[CarbohydrateType["LUNCH"] = 2] = "LUNCH";
    CarbohydrateType[CarbohydrateType["DINNER"] = 3] = "DINNER";
    CarbohydrateType[CarbohydrateType["SNACK"] = 4] = "SNACK";
    CarbohydrateType[CarbohydrateType["DRINK"] = 5] = "DRINK";
    CarbohydrateType[CarbohydrateType["SUPPER"] = 6] = "SUPPER";
    CarbohydrateType[CarbohydrateType["BRUNCH"] = 7] = "BRUNCH";
})(CarbohydrateType || (CarbohydrateType = {}));
export var MealType;
(function (MealType) {
    MealType[MealType["PREPRANDIAL"] = 1] = "PREPRANDIAL";
    MealType[MealType["POSTPRANDIAL"] = 2] = "POSTPRANDIAL";
    MealType[MealType["FASTING"] = 3] = "FASTING";
    MealType[MealType["CASUAL"] = 4] = "CASUAL";
    MealType[MealType["BEDTIME"] = 5] = "BEDTIME";
})(MealType || (MealType = {}));
export var TesterType;
(function (TesterType) {
    TesterType[TesterType["SELF"] = 1] = "SELF";
    TesterType[TesterType["HEALTH_CARE_PROFESSIONAL"] = 2] = "HEALTH_CARE_PROFESSIONAL";
    TesterType[TesterType["LAB_TEST"] = 3] = "LAB_TEST";
    TesterType[TesterType["TESTER_NOT_AVAILABLE"] = 15] = "TESTER_NOT_AVAILABLE";
})(TesterType || (TesterType = {}));
export var HealthType;
(function (HealthType) {
    HealthType[HealthType["MINOR_HEALTH_ISSUES"] = 1] = "MINOR_HEALTH_ISSUES";
    HealthType[HealthType["MAJOR_HEALTH_ISSUES"] = 2] = "MAJOR_HEALTH_ISSUES";
    HealthType[HealthType["DURING_MENSES"] = 3] = "DURING_MENSES";
    HealthType[HealthType["UNDER_STRESS"] = 4] = "UNDER_STRESS";
    HealthType[HealthType["NO_HEALTH_ISSUES"] = 5] = "NO_HEALTH_ISSUES";
    HealthType[HealthType["HEALTH_NOT_AVAILABLE"] = 15] = "HEALTH_NOT_AVAILABLE";
})(HealthType || (HealthType = {}));
export var MedicationType;
(function (MedicationType) {
    MedicationType[MedicationType["RAPID_ACTING_INSULIN"] = 1] = "RAPID_ACTING_INSULIN";
    MedicationType[MedicationType["SHORT_ACTING_INSULIN"] = 2] = "SHORT_ACTING_INSULIN";
    MedicationType[MedicationType["INTERMEDIATE_ACTING_INSULIN"] = 3] = "INTERMEDIATE_ACTING_INSULIN";
    MedicationType[MedicationType["LONG_ACTING_INSULIN"] = 4] = "LONG_ACTING_INSULIN";
    MedicationType[MedicationType["PRE_MIXED_INSULIN"] = 5] = "PRE_MIXED_INSULIN";
})(MedicationType || (MedicationType = {}));
export var TemperatureType;
(function (TemperatureType) {
    TemperatureType[TemperatureType["ARMPIT"] = 1] = "ARMPIT";
    TemperatureType[TemperatureType["BODY"] = 2] = "BODY";
    TemperatureType[TemperatureType["EAR_LOBE"] = 3] = "EAR_LOBE";
    TemperatureType[TemperatureType["FINGER"] = 4] = "FINGER";
    TemperatureType[TemperatureType["GASTRO_INTESTINAL_TRACT"] = 5] = "GASTRO_INTESTINAL_TRACT";
    TemperatureType[TemperatureType["MOUTH"] = 6] = "MOUTH";
    TemperatureType[TemperatureType["RECTUM"] = 7] = "RECTUM";
    TemperatureType[TemperatureType["TOE"] = 8] = "TOE";
    TemperatureType[TemperatureType["TYMPANUM"] = 9] = "TYMPANUM";
})(TemperatureType || (TemperatureType = {}));
//# sourceMappingURL=enums.js.map