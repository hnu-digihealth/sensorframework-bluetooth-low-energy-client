import {BluetoothGATTByteData, BluetoothGATTCallback} from "../../definitions";
import {getSFloat, toDataView} from "../utils";

export const GlucoseMeasurementContextCallback: BluetoothGATTCallback = (data: BluetoothGATTByteData) => {

    const view = toDataView(data);

    const flags = view.getUint8(0);

    let index = 1;
    let context = {};

    const sequenceNumber = view.getUint16(index, true);
    index += 2;

    context = {...context, sequenceNumber};

    const extendedFlagsPresent = flags & 0x80;

    if(extendedFlagsPresent){
        //No definition for extended flags given by now
        index += 1;
    }

    const carbohydrateIdAndCarbohydratePresent = flags & 0x1;

    if(carbohydrateIdAndCarbohydratePresent){

        const carbohydrateId = view.getUint8(index);
        index += 1;

        const carbohydrate = getSFloat(view, index);
        index += 2;

        const carbohydrateUnit = "g";

        context = {...context, carbohydrateId, carbohydrate, carbohydrateUnit};
    }

    const mealPresent = flags & 0x2;

    if(mealPresent){

        const meal = view.getUint8(index);
        index += 1;

        context = {...context, meal};
    }

    const testerPresent = flags & 0x4;

    if(testerPresent){

        const testerHealthByte = view.getUint8(index);
        index += 1;

        const tester = testerHealthByte & 0xF;
        const health = (testerHealthByte >> 4) & 0xF;

        context = {...context, tester, health};
    }

    const exerciseDurationAndIntensityPresent = flags & 0x8;

    if(exerciseDurationAndIntensityPresent){

        const exerciseDuration = view.getUint16(index, true);
        index += 2;

        const exerciseIntensity = view.getUint8(index);
        index += 1;

        context = {...context, exerciseDuration, exerciseIntensity};

    }

    const medicationIdAndMedicationPresent = flags & 0x10;

    if(medicationIdAndMedicationPresent){

        const medicationId = view.getUint8(index);
        index += 1;

        const medicationUnit = (flags & 0x20) ? "ml" : "mg";

        const medication = getSFloat(view, index);
        index += 2;



        context = {...context, medicationId, medication, medicationUnit};

    }

    const hbA1cPresent = flags & 0x40;

    if (hbA1cPresent){

        const hbA1c = view.getUint16(index, true);
        index += 2;

        context = {...context, hbA1c};

    }

    return context;

};

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
