import { getSFloat, toDataView } from "../utils";
export const GlucoseMeasurementContextCallback = (data) => {
    const view = toDataView(data);
    const flags = view.getUint8(0);
    let index = 1;
    let context = {};
    const sequenceNumber = view.getUint16(index, true);
    index += 2;
    context = Object.assign({}, context, { sequenceNumber });
    const extendedFlagsPresent = flags & 0x80;
    if (extendedFlagsPresent) {
        //No definition for extended flags given by now
        index += 1;
    }
    const carbohydrateIdAndCarbohydratePresent = flags & 0x1;
    if (carbohydrateIdAndCarbohydratePresent) {
        const carbohydrateId = view.getUint8(index);
        index += 1;
        const carbohydrate = getSFloat(view, index);
        index += 2;
        const carbohydrateUnit = "g";
        context = Object.assign({}, context, { carbohydrateId, carbohydrate, carbohydrateUnit });
    }
    const mealPresent = flags & 0x2;
    if (mealPresent) {
        const meal = view.getUint8(index);
        index += 1;
        context = Object.assign({}, context, { meal });
    }
    const testerPresent = flags & 0x4;
    if (testerPresent) {
        const testerHealthByte = view.getUint8(index);
        index += 1;
        const tester = testerHealthByte & 0xF;
        const health = (testerHealthByte >> 4) & 0xF;
        context = Object.assign({}, context, { tester, health });
    }
    const exerciseDurationAndIntensityPresent = flags & 0x8;
    if (exerciseDurationAndIntensityPresent) {
        const exerciseDuration = view.getUint16(index, true);
        index += 2;
        const exerciseIntensity = view.getUint8(index);
        index += 1;
        context = Object.assign({}, context, { exerciseDuration, exerciseIntensity });
    }
    const medicationIdAndMedicationPresent = flags & 0x10;
    if (medicationIdAndMedicationPresent) {
        const medicationId = view.getUint8(index);
        index += 1;
        const medicationUnit = (flags & 0x20) ? "ml" : "mg";
        const medication = getSFloat(view, index);
        index += 2;
        context = Object.assign({}, context, { medicationId, medication, medicationUnit });
    }
    const hbA1cPresent = flags & 0x40;
    if (hbA1cPresent) {
        const hbA1c = view.getUint16(index, true);
        index += 2;
        context = Object.assign({}, context, { hbA1c });
    }
    return context;
};
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
//# sourceMappingURL=glucose-measurement-context.js.map